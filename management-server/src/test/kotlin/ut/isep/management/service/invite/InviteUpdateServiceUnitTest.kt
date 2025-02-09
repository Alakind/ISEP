package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteUpdateDTO
import enumerable.InviteStatus
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.web.client.RestTemplate
import org.springframework.web.reactive.function.client.WebClient
import parser.question.MultipleChoiceQuestion
import reactor.core.publisher.Mono
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.SolvedAssignmentMultipleChoice
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
    @Disabled
    fun `test startAutoScoring() that exception is thrown when question can't be fetched`() {

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
    @Disabled
    fun `test startAutoScoring() that other than multiple choice assignments are skipped`() {

    }
}