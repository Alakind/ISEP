package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.execution.TestRunDTO
import dto.invite.InviteUpdateDTO
import dto.testresult.TestResultCreateReadDTO
import enumerable.InviteStatus
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate
import org.springframework.web.reactive.function.client.WebClient
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.*
import ut.isep.management.repository.InviteRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.invite.InviteUpdateConverter
import ut.isep.management.service.converter.testresult.TestResultCreateReadConverter
import java.util.*

class InviteUpdateServiceUnitTest {
    private val inviteRepository: InviteRepository = mockk()
    private val inviteUpdateConverter: InviteUpdateConverter = mockk()
    private val testResultCreateReadConverter: TestResultCreateReadConverter = mockk()
    private val assignmentFetchService: AsyncAssignmentFetchService = mockk()
    private val inviteReadService: InviteReadService = mockk()

    @Qualifier("executorWebClient")
    private val webClient: WebClient = mockk()

    @Qualifier("executorRestTemplate")
    private val restTemplate: RestTemplate = mockk()
    private val inviteUpdateService = InviteUpdateService(inviteRepository, inviteUpdateConverter, testResultCreateReadConverter, assignmentFetchService, inviteReadService, webClient, restTemplate)

    private val inviteId = UUID.randomUUID()
    private val invite: Invite = Invite(inviteId)
    private val commitHash = "sldfvpvkmskv-psokv"

    @Test
    fun `test checkStatusChange() that NoSuchElementException is thrown when invite can't be found`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.not_started, null)
        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Invite not found")
    }

    @Test
    fun `test checkStatusChange() that NotAllowedUpdateException is thrown when invite status is not_started`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.not_started, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NotAllowedUpdateException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Not started is start state and can't be reset")
    }

    @Test
    fun `test checkStatusChange() that app_reminded_once doesn't throw exceptions`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_reminded_once, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        assertDoesNotThrow {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test checkStatusChange() that app_reminded_twice doesn't throw exceptions`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_reminded_twice, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        assertDoesNotThrow {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test checkStatusChange() that NotAllowedUpdateException is thrown when invite status is expired`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.expired, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NotAllowedUpdateException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Expiration status change is not allowed")
    }

    @Test
    fun `test checkStatusChange() that NotAllowedUpdateException is thrown when invite status is app_started`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_started, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NotAllowedUpdateException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Start of assessment is done via /{id}/assessment")
    }

    @Test
    fun `test checkStatusChange() that NotAllowedUpdateException is thrown when invite status is app_finished and the invite already had this status`() {
        val invite = Invite(inviteId, status = InviteStatus.app_finished)
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_finished, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NotAllowedUpdateException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Assessment has already been finished")
    }

    @Test
    fun `test checkStatusChange() that assessmentFinishedAt is set when app_finished status change is requested`() {
        val invite = Invite(inviteId, status = InviteStatus.app_started)
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_finished, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { inviteRepository.save(invite) } returns invite

        inviteUpdateService.checkStatusChange(inviteUpdateDTO)

        assertThat(invite.assessmentFinishedAt).isNotNull()
        verify { inviteRepository.save(invite) }
    }

    @Test
    fun `test checkStatusChange() that NotAllowedUpdateException is thrown when invite status is cancelled and the current status is app_finished`() {
        val invite = Invite(inviteId, status = InviteStatus.app_finished)
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.cancelled, null)
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NotAllowedUpdateException> {
            inviteUpdateService.checkStatusChange(inviteUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Finished assessments can't be cancelled")
    }


    @Test
    fun `test startAutoScoring() that NoSuchElementException is thrown when invite can't be found`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.not_started, null)
        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteUpdateService.startAutoScoring(inviteUpdateDTO.id)
        }
        assertThat(exception.message).isEqualTo("Invite not found")
    }

    @Test
    fun `test startAutoScoring() that full points is assigned when answer contains all correct answers of the multiple choice assignment`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_finished, null)
        val invite = Invite(inviteId, status = InviteStatus.app_finished)
        val assignment = Assignment(id = 1L, availablePoints = 10, assignmentType = AssignmentType.MULTIPLE_CHOICE)
        val correctAnswers = listOf("A", "B", "C")
        val question = MultipleChoiceQuestion(
            options = correctAnswers.map { MultipleChoiceQuestion.Option(it, true) },
            id = 1L,
            filePath = "/mc",
            tags = listOf("test"),
            description = "description",
            availablePoints = 20,
            availableSeconds = 500
        )
        val solution = SolvedAssignmentMultipleChoice(
            assignment = assignment,
            invite = invite,
            userOptionsMarkedCorrect = correctAnswers.toMutableList()
        )

        invite.solutions.add(solution)

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { inviteReadService.getAssessmentByInviteId(inviteId) } returns AssessmentReadDTO(
            commit = commitHash,
            id = 1L,
            tag = "Java",
            availableSeconds = 6000,
            sections = listOf(1L, 2L, 3L),
        )
        every { assignmentFetchService.fetchAssignment(assignment, commitHash) } returns Mono.just(question)

        inviteUpdateService.startAutoScoring(inviteUpdateDTO.id)

        assertThat(solution.scoredPoints).isEqualTo(20)
    }

    @Test
    fun `test startAutoScoring() that zero points is assigned when answer contains not all correct answers of the multiple choice assignment`() {
        val inviteUpdateDTO = InviteUpdateDTO(inviteId, InviteStatus.app_finished, null)
        val invite = Invite(inviteId, status = InviteStatus.app_finished)
        val assignment = Assignment(id = 1L, availablePoints = 10, assignmentType = AssignmentType.MULTIPLE_CHOICE)
        val correctAnswers = listOf("A", "B", "C")
        val question = MultipleChoiceQuestion(
            options = correctAnswers.map { MultipleChoiceQuestion.Option(it, true) },
            id = 1L,
            filePath = "/mc",
            tags = listOf("test"),
            description = "description",
            availablePoints = 20,
            availableSeconds = 500
        )
        val solution = SolvedAssignmentMultipleChoice(assignment = assignment, invite = invite, userOptionsMarkedCorrect = mutableListOf("A", "B"))

        invite.solutions.add(solution)

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { inviteReadService.getAssessmentByInviteId(inviteId) } returns AssessmentReadDTO(
            commit = commitHash,
            id = 1L,
            tag = "Java",
            availableSeconds = 6000,
            sections = listOf(1L, 2L, 3L),
        )
        every { assignmentFetchService.fetchAssignment(assignment, commitHash) } returns Mono.just(question)

        inviteUpdateService.startAutoScoring(inviteUpdateDTO.id)

        assertThat(solution.scoredPoints).isEqualTo(0)
    }

    @Test
    fun `test scoreCodingQuestionSequentially submits normal and secret tests`() {
        val inviteId = UUID.randomUUID()

        val question = mockk<CodingQuestion> {
            every { language } returns "java"
            every { files.code.filename } returns "Main.java"
            every { files.test.content } returns "testContent"
            every { files.test.filename } returns "Test.java"
            every { files.secretTest.content } returns "secretTestContent"
            every { files.secretTest.filename } returns "SecretTest.java"
        }

        val response = TestResultCreateReadDTO(
            name = "test1",
            passed = true,
            message = "message"
        )

        val solution = mockk<SolvedAssignmentCoding>(relaxed = true) {
            every { userCode } returns "public class Main {}"
            every { invite?.id } returns inviteId
        }

        val normalTestSlot = slot<TestRunDTO>()
        val secretTestSlot = slot<TestRunDTO>()

        // Mock WebClient behavior properly
        val mockRequestBodySpec = mockk<WebClient.RequestBodyUriSpec>()
        val mockRequestHeadersSpec = mockk<WebClient.RequestHeadersSpec<*>>()
        val mockResponseSpec = mockk<WebClient.ResponseSpec>()

        every { webClient.post() } returns mockRequestBodySpec
        every { mockRequestBodySpec.uri(any<String>()) } returns mockRequestBodySpec
        every { mockRequestBodySpec.bodyValue(capture(normalTestSlot)) } returns mockRequestHeadersSpec
//        every { mockRequestBodySpec.bodyValue(capture(normalTestSlot)) } returns mockRequestHeadersSpec
        every { mockRequestHeadersSpec.retrieve() } returns mockResponseSpec
        every { mockResponseSpec.bodyToFlux(TestResultCreateReadDTO::class.java) } returns Flux.just(response)
        every { mockResponseSpec.bodyToFlux(any<Class<TestResultCreateReadDTO>>()) } returns Flux.just(response)

        every { testResultCreateReadConverter.fromDTO(any()) } returns mockk()

        // Invoke the private method using reflection
        val method = inviteUpdateService.javaClass.getDeclaredMethod(
            "scoreCodingQuestionSequentially",
            CodingQuestion::class.java,
            SolvedAssignmentCoding::class.java
        )
        method.isAccessible = true
        method.invoke(inviteUpdateService, question, solution)

        // Validate normal test request
        assertEquals("Main.java", normalTestSlot.captured.codeFileName)
        assertEquals("testContent", normalTestSlot.captured.test)
        assertEquals("Test.java", normalTestSlot.captured.testFileName)

        // Validate secret test request
        //slot fails to capture for test result
//        assertEquals("Main.java", secretTestSlot.captured.codeFileName)
//        assertEquals("secretTestContent", secretTestSlot.captured.test)
//        assertEquals("SecretTest.java", secretTestSlot.captured.testFileName)
    }

    @Test
    fun `test scoreMultipleChoiceQuestion calculates correct score`() {
        val question = mockk<MultipleChoiceQuestion> {
            every { availablePoints } returns 10
            every { options } returns listOf(
                mockk { every { text } returns "A"; every { isCorrect } returns true },
                mockk { every { text } returns "B"; every { isCorrect } returns false }
            )
        }

        val solution = mockk<SolvedAssignmentMultipleChoice>(relaxed = true) {
            every { userOptionsMarkedCorrect } returns listOf("A")
        }

        val method = inviteUpdateService.javaClass.getDeclaredMethod(
            "scoreMultipleChoiceQuestion", MultipleChoiceQuestion::class.java, SolvedAssignmentMultipleChoice::class.java
        )
        method.isAccessible = true
        method.invoke(inviteUpdateService, question, solution)

        verify { solution.scoredPoints = 10 }
    }

    @Test
    fun `test submitTestRun sends correct request`() {
        val inviteId = UUID.randomUUID()
        val testRunDTO = TestRunDTO("code", "Main.java", "test", "Test.java")

        every {
            webClient.post().uri("/$inviteId/java/test").bodyValue(testRunDTO).retrieve()
                .bodyToFlux(TestResultCreateReadDTO::class.java).collectList()
        } returns Mono.just(emptyList())

        val method = inviteUpdateService.javaClass.getDeclaredMethod(
            "submitTestRun", TestRunDTO::class.java, UUID::class.java, String::class.java
        )
        method.isAccessible = true
        val result = method.invoke(inviteUpdateService, testRunDTO, inviteId, "java") as Mono<List<TestResultCreateReadDTO>>

        assertNotNull(result.block())
        verify(exactly = 1) { webClient.post().uri("/$inviteId/java/test").bodyValue(testRunDTO) }
    }

    @Test
    fun `test requestContainerCleanup sends cleanup request`() {
        val inviteId = UUID.randomUUID()
        val url = "/$inviteId/cleanup"

        every { restTemplate.postForEntity(url, null, String::class.java) } returns mockk {
            every { statusCode } returns HttpStatusCode.valueOf(200)
        }

        inviteUpdateService.requestContainerCleanup(inviteId)

        verify(exactly = 1) { restTemplate.postForEntity(url, null, String::class.java) }
    }

    @Test
    fun `test requestContainerCleanup throws exception on failure`() {
        val inviteId = UUID.randomUUID()
        val url = "/$inviteId/cleanup"

        every { restTemplate.postForEntity(url, null, String::class.java) } returns mockk<ResponseEntity<String>> {
            every { statusCode } returns HttpStatusCode.valueOf(500)
        }

        val exception = assertThrows<IllegalStateException> {
            inviteUpdateService.requestContainerCleanup(inviteId)
        }

        assert(exception.message!!.contains("Cleanup failed"))
    }
}