package ut.isep.management.service.invite

import dto.execution.TestResultDTO
import dto.execution.TestRunDTO
import dto.invite.InviteUpdateDTO
import enumerable.InviteStatus
import org.apache.hc.core5.http.NoHttpResponseException
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.core.ParameterizedTypeReference
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.*
import ut.isep.management.service.UpdateService
import ut.isep.management.service.assignment.AssignmentFetchService
import ut.isep.management.service.converter.UpdateConverter
import ut.isep.management.service.converter.execution.TestResultCreateConverter
import java.time.OffsetDateTime
import java.util.*

@Service
class InviteUpdateService(
    repository: JpaRepository<Invite, UUID>,
    converter: UpdateConverter<Invite, InviteUpdateDTO>,
    @Qualifier("executorRestTemplate")
    val restTemplate: RestTemplate,
    val testResultConverter: TestResultCreateConverter,
    val fetchService: AssignmentFetchService,
    val inviteReadService: InviteReadService,
) : UpdateService<Invite, InviteUpdateDTO, UUID>(repository, converter) {

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

    fun startAutoScoring(inviteUpdateDTO: InviteUpdateDTO) {
        val invite = repository.findById(inviteUpdateDTO.id).orElseThrow { NoSuchElementException("Invite not found") }

        // Multiple choice auto scorable other assignments aren't
        val scorableAssignments = invite.solutions.filter {
            it.assignment!!.assignmentType!! == AssignmentType.CODING ||
                    it.assignment!!.assignmentType!! == AssignmentType.MULTIPLE_CHOICE
        }

        scorableAssignments.forEach { solution ->
            val commitHash = inviteReadService.getAssessmentByInviteId(inviteUpdateDTO.id).commit
            when (val fetchedQuestion = fetchService.fetchAssignment(solution.assignment!!, commitHash)) {
                is MultipleChoiceQuestion -> {
                    scoreMultipleChoiceQuestion(fetchedQuestion, solution as SolvedAssignmentMultipleChoice)
                }
                is CodingQuestion -> {
                    scoreCodingQuestion(fetchedQuestion, solution as SolvedAssignmentCoding)
                }
                else -> {
                    throw IllegalStateException(
                        "Retrieved assignment ${fetchedQuestion.id} with type ${fetchedQuestion.type} from GitHub " +
                                "REST API but type of stored solution is ${solution.assignment!!.assignmentType!!}")
                }
            }
        }
    }

    fun scoreMultipleChoiceQuestion(question: MultipleChoiceQuestion, solution: SolvedAssignmentMultipleChoice) {
        val userAnswers = solution.userOptionsMarkedCorrect.toSet()
        val correctAnswers = question.options.filter { it.isCorrect }.map { it.text }
        solution.scoredPoints = if (userAnswers.size == correctAnswers.size && correctAnswers.toSet() == userAnswers.toSet()) {
            question.availablePoints
        } else {
            0
        }
    }

    fun scoreCodingQuestion(question: CodingQuestion, solution: SolvedAssignmentCoding) {
        val normalTest = TestRunDTO(
            code = solution.userCode ?: "",
            codeFileName = question.files.code.filename,
            test = question.files.test.content,
            testFileName = question.files.test.filename
        )
        val responseType = object : ParameterizedTypeReference<List<TestResultDTO>>() {}

        val normalTestResults: List<TestResultDTO> = restTemplate.exchange(
            "https://localhost:8080/",
            HttpMethod.POST,
            HttpEntity(normalTest),
            responseType
        ).body ?: throw NoHttpResponseException("No response when submitting final test")

        solution.testResults.addAll(
            normalTestResults.map {
                testResultConverter.fromDTO(it)
            }
        )

        val secretTest = TestRunDTO(
            code = solution.userCode ?: "",
            codeFileName = question.files.code.filename,
            test = question.files.secretTest.content,
            testFileName = question.files.secretTest.filename
        )
        val secretTestResults: List<TestResultDTO> = restTemplate.exchange(
            "https://localhost:8080/",
            HttpMethod.POST,
            HttpEntity(secretTest),
            responseType
        ).body ?: throw NoHttpResponseException("No response when submitting final test")

        solution.testResults.addAll(
            secretTestResults.map {
                testResultConverter.fromDTO(it)
            }
        )
    }
}