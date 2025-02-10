package ut.isep.management.service.invite

import dto.execution.TestRunDTO
import dto.invite.InviteUpdateDTO
import dto.testresult.TestResultCreateReadDTO
import enumerable.InviteStatus
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.reactive.function.client.WebClient
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.SolvedAssignmentCoding
import ut.isep.management.model.entity.SolvedAssignmentMultipleChoice
import ut.isep.management.repository.InviteRepository
import ut.isep.management.service.UpdateService
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.invite.InviteUpdateConverter
import ut.isep.management.service.converter.testresult.TestResultCreateReadConverter
import ut.isep.management.util.logger
import java.time.OffsetDateTime
import java.util.*

@Service
class InviteUpdateService(
    repository: InviteRepository,
    converter: InviteUpdateConverter,
    val testResultConverter: TestResultCreateReadConverter,
    val fetchService: AsyncAssignmentFetchService,
    val inviteReadService: InviteReadService,
    @Qualifier("executorWebClient")
    val webClient: WebClient,
    @Qualifier("executorRestTemplate")
    val restTemplate: RestTemplate,
) : UpdateService<Invite, InviteUpdateDTO, UUID>(repository, converter) {

    val log = logger()

    fun checkStatusChange(inviteUpdateDTO: InviteUpdateDTO) {
        val status = inviteUpdateDTO.status!!
        val invite = repository.findById(inviteUpdateDTO.id).orElseThrow { NoSuchElementException("Invite not found") }
        when (status) {
            InviteStatus.not_started -> throw NotAllowedUpdateException("Not started is start state and can't be reset")
            InviteStatus.expired -> throw NotAllowedUpdateException("Expiration status change is not allowed")
            InviteStatus.app_started -> throw NotAllowedUpdateException("Start of assessment is done via /{id}/assessment")
            InviteStatus.app_finished -> {
                if (invite.status != InviteStatus.app_finished) {
                    invite.assessmentFinishedAt = OffsetDateTime.now()
                    repository.save(invite)
                } else {
                    throw NotAllowedUpdateException("Assessment has already been finished")
                }
            }

            InviteStatus.cancelled -> {
                if (invite.status == InviteStatus.app_finished) {
                    throw NotAllowedUpdateException("Finished assessments can't be cancelled")
                }
            }

            InviteStatus.app_reminded_once, InviteStatus.app_reminded_twice -> {}
        }
    }

    fun startAutoScoring(inviteId: UUID) {
        log.info("Autoscoring invite $inviteId")
        val invite = repository.findById(inviteId).orElseThrow { NoSuchElementException("Invite not found") }

        // Fetch the commit hash for the assessment
        val commitHash = inviteReadService.getAssessmentByInviteId(inviteId).commit

        // Fetch and score assignments in parallel
        Flux.fromIterable(invite.solutions)
            .filter { solution ->
                solution.assignment!!.assignmentType!! == AssignmentType.CODING ||
                        solution.assignment!!.assignmentType!! == AssignmentType.MULTIPLE_CHOICE
            }
            .flatMap { solution ->
                fetchService.fetchAssignment(solution.assignment!!, commitHash)
                    .flatMap { question ->
                        log.info("Autoscoring ${question.type} question ${question.id} for ${question.availablePoints} points")
                        when (question) {
                            is MultipleChoiceQuestion -> {
                                scoreMultipleChoiceQuestion(question, solution as SolvedAssignmentMultipleChoice)
                                Mono.just(solution)
                            }

                            is CodingQuestion -> {
                                scoreCodingQuestionSequentially(question, solution as SolvedAssignmentCoding)
                                    .thenReturn(solution)
                            }

                            else -> {
                                Mono.error(
                                    IllegalStateException(
                                        "Retrieved assignment ${question.id} with type ${question.type} from GitHub " +
                                                "REST API but type of stored solution is ${solution.assignment!!.assignmentType!!}"
                                    )
                                )
                            }
                        }
                    }
            }
            .collectList()
            .block() // Block to wait for all scoring to complete
    }

    private fun scoreCodingQuestionSequentially(question: CodingQuestion, solution: SolvedAssignmentCoding): Mono<Unit> {
        val normalTest = TestRunDTO(
            code = solution.userCode ?: "",
            codeFileName = question.files.code.filename,
            test = question.files.test.content,
            testFileName = question.files.test.filename
        )

        val secretTest = TestRunDTO(
            code = solution.userCode ?: "",
            codeFileName = question.files.code.filename,
            test = question.files.secretTest.content,
            testFileName = question.files.secretTest.filename
        )

        // Submit normal test and secret test sequentially
        return submitTestRun(normalTest, solution.invite!!.id, question.language)
            .flatMap { normalTestResults ->
                val resultEntities = normalTestResults.map { testResultConverter.fromDTO(it) }
                solution.addTestResults(resultEntities)
                submitTestRun(secretTest, solution.invite!!.id, question.language)
            }
            .doOnSuccess { secretTestResults ->
                val resultEntities = secretTestResults.map { secretResultDTO ->
                    testResultConverter.fromDTO(secretResultDTO)
                }
                solution.addSecretTestResults(resultEntities)
            }
            .thenReturn(Unit) // Return Mono<Unit> after side effects are applied
    }

    private fun scoreMultipleChoiceQuestion(question: MultipleChoiceQuestion, solution: SolvedAssignmentMultipleChoice) {
        val userAnswers = solution.userOptionsMarkedCorrect.toSet()
        val correctAnswers = question.options.filter { it.isCorrect }.map { it.text }
        solution.scoredPoints =
            if (userAnswers.size == correctAnswers.size && correctAnswers.toSet() == userAnswers.toSet()) {
                question.availablePoints
            } else {
                0
            }
    }

    private fun submitTestRun(
        testRun: TestRunDTO,
        inviteId: UUID,
        language: String
    ): Mono<List<TestResultCreateReadDTO>> {
        val url = "/$inviteId/${language.lowercase()}/test"
        log.info("Sending test run for ${language.lowercase()} question to $url in invite $inviteId")
        return webClient.post()
            .uri(url)
            .bodyValue(testRun)
            .retrieve()
            .bodyToFlux(TestResultCreateReadDTO::class.java)
            .collectList()
            .onErrorResume { error ->
                Mono.error(IllegalStateException("Couldn't retrieve test results for invite $inviteId, code ${testRun.codeFileName}, test ${testRun.testFileName}", error))
            }
    }

    fun requestContainerCleanup(inviteId: UUID) {
        val url = "/$inviteId/cleanup"
        log.info("Sending POST request to $url to clean up all containers for invite $inviteId")

        val response = restTemplate.postForEntity(url, null, String::class.java)
        if (!response.statusCode.is2xxSuccessful) {
            throw IllegalStateException("Cleanup failed with status: ${response.statusCode}")
        }
    }
}