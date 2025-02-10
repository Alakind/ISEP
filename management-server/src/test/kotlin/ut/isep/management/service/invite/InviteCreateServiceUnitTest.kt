package ut.isep.management.service.invite

import dto.invite.InviteCreateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.model.entity.*
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import java.time.OffsetDateTime
import java.util.*

class InviteCreateServiceUnitTest {

    private val inviteRepository: InviteRepository = mockk()
    private val applicantRepository: ApplicantRepository = mockk()
    private val assessmentRepository: AssessmentRepository = mockk()
    private val inviteCreateService: InviteCreateService = InviteCreateService(inviteRepository, applicantRepository, assessmentRepository)

    @Test
    fun `test create() throws NosSuchElementException when applicant can't be found`() {
        val createDto = InviteCreateDTO(1L, 2L, OffsetDateTime.now())

        every { applicantRepository.findById(1L) } returns Optional.empty()
        every { assessmentRepository.findById(2L) } returns Optional.of(mockk())

        val exception = assertThrows<NoSuchElementException> {
            inviteCreateService.create(createDto)
        }

        assertThat(exception.message).isEqualTo("Applicant not found")
    }

    @Test
    fun `test create() throws NosSuchElementException when assessment can't be found`() {
        val createDto = InviteCreateDTO(1L, 2L, OffsetDateTime.now())

        every { applicantRepository.findById(1L) } returns Optional.of(mockk())
        every { assessmentRepository.findById(2L) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteCreateService.create(createDto)
        }

        assertThat(exception.message).isEqualTo("Assessment not found")
    }

    @Test
    fun `test create() that created invite has correct applicant, assessment, and expiration date`() {
        val applicant = mockk<Applicant>(relaxed = true) {
            every { id } returns 1L
        }
        val assignment1 = mockk<Assignment>(relaxed = true) {
            every { id } returns 1L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val assignment2 = mockk<Assignment>(relaxed = true) {
            every { id } returns 2L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val section = mockk<Section>(relaxed = true) {
            every { assignments } returns mutableListOf(assignment1, assignment2)
            every { assignments.iterator() } returns mutableListOf(assignment1, assignment2).iterator()
        }
        val assessment = mockk<Assessment>(relaxed = true) {
            every { id } returns 2L
            every { sections } returns mutableListOf(section)
        }
        val expiresAt = OffsetDateTime.now().plusDays(7)
        val createDto = InviteCreateDTO(1L, 2L, expiresAt)

        val inviteSlot = slot<Invite>()

        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { assessmentRepository.findById(2L) } returns Optional.of(assessment)
        every { applicantRepository.save(applicant) } returns applicant
        every { assessmentRepository.save(assessment) } returns assessment
        every { inviteRepository.save(capture(inviteSlot)) } answers { inviteSlot.captured }

        val result = inviteCreateService.create(createDto)

        assertThat(result).isEqualTo(inviteSlot.captured)
        assertThat(result.expiresAt).isEqualTo(expiresAt)
        assertThat(result.assessment).isEqualTo(assessment)
        assertThat(result.applicant).isEqualTo(applicant)
        assertThat(result.solutions).isNotEmpty
    }

    @Test
    fun `test create() that applicant has the created invite in their invites attribute`() {
        val applicant = mockk<Applicant>(relaxed = true) {
            every { id } returns 1L
            every { invites } returns mutableListOf()
        }
        val assignment1 = mockk<Assignment>(relaxed = true) {
            every { id } returns 1L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val assignment2 = mockk<Assignment>(relaxed = true) {
            every { id } returns 2L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val section = mockk<Section>(relaxed = true) {
            every { assignments } returns mutableListOf(assignment1, assignment2)
            every { assignments.iterator() } returns mutableListOf(assignment1, assignment2).iterator()
        }
        val assessment = mockk<Assessment>(relaxed = true) {
            every { id } returns 2L
            every { sections } returns mutableListOf(section)
        }
        val expiresAt = OffsetDateTime.now().plusDays(7)
        val createDto = InviteCreateDTO(1L, 2L, expiresAt)

        val inviteSlot = slot<Invite>()

        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { assessmentRepository.findById(2L) } returns Optional.of(assessment)
        every { applicantRepository.save(applicant) } answers {
            applicant.invites.add(inviteSlot.captured)
            applicant
        }
        every { assessmentRepository.save(assessment) } returns assessment
        every { inviteRepository.save(capture(inviteSlot)) } answers { inviteSlot.captured }

        val result = inviteCreateService.create(createDto)

        assertThat(applicant.invites).contains(result)

        verify { applicantRepository.save(applicant) }
    }

    @Test
    fun `test create() that assessment has the created invite in their invites attribute`() {
        val applicant = mockk<Applicant>(relaxed = true) {
            every { id } returns 1L
        }
        val assignment1 = mockk<Assignment>(relaxed = true) {
            every { id } returns 1L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val assignment2 = mockk<Assignment>(relaxed = true) {
            every { id } returns 2L
            every { assignmentType } returns AssignmentType.OPEN
        }
        val section = mockk<Section>(relaxed = true) {
            every { assignments } returns mutableListOf(assignment1, assignment2)
            every { assignments.iterator() } returns mutableListOf(assignment1, assignment2).iterator()
        }
        val assessment = mockk<Assessment>(relaxed = true) {
            every { id } returns 2L
            every { sections } returns mutableListOf(section)
            every { invites } returns mutableListOf()
        }
        val expiresAt = OffsetDateTime.now().plusDays(7)
        val createDto = InviteCreateDTO(1L, 2L, expiresAt)

        val inviteSlot = slot<Invite>()

        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { assessmentRepository.findById(2L) } returns Optional.of(assessment)
        every { applicantRepository.save(applicant) } returns applicant
        every { assessmentRepository.save(assessment) } answers {
            assessment.invites.add(inviteSlot.captured)
            assessment
        }
        every { inviteRepository.save(capture(inviteSlot)) } answers { inviteSlot.captured }

        val result = inviteCreateService.create(createDto)

        assertThat(assessment.invites).contains(result)

        verify { applicantRepository.save(applicant) }
    }
}