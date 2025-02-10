package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import dto.invite.PreInfoReadDTO
import enumerable.InviteStatus
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.jpa.domain.Specification
import org.springframework.web.reactive.function.client.WebClient
import ut.isep.management.exception.AssessmentTimeExceededException
import ut.isep.management.exception.UnauthorizedException
import ut.isep.management.model.entity.*
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import ut.isep.management.service.converter.invite.PreInfoReadConverter
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

class InviteReadServiceUnitTest {

    private val inviteRepository: InviteRepository = mockk()
    private val inviteReadConverter: InviteReadConverter = mockk()
    private val assignmentFetchService: AsyncAssignmentFetchService = mockk()

    @Qualifier("executorWebClient")
    private val webClient: WebClient = mockk()
    private val assessmentReadConverter: AssessmentReadConverter = mockk()
    private val timingPerSectionRepository: TimingPerSectionRepository = mockk()
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService = mockk()
    private val preInfoReadConverter: PreInfoReadConverter = mockk()
    private val inviteReadService = InviteReadService(
        inviteRepository,
        inviteReadConverter,
        assignmentFetchService,
        webClient,
        assessmentReadConverter,
        timingPerSectionRepository,
        timingPerSectionUpdateService,
        preInfoReadConverter
    )

    @Test
    fun `test getAssessmentByInviteId() throws an NoSuchElementException when invite can't be found`() {
        val inviteId = UUID.randomUUID()

        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteReadService.getAssessmentByInviteId(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invite not found for the assessment")
    }

    @Test
    fun `test getAssessmentByInviteId() returns converted assessment`() {
        val inviteId = UUID.randomUUID()
        val assessment = mockk<Assessment>()
        val invite = mockk<Invite> {
            every { this@mockk.assessment } returns assessment
        }
        val expectedDTO = mockk<AssessmentReadDTO>()

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { assessmentReadConverter.toDTO(assessment) } returns expectedDTO

        val result = inviteReadService.getAssessmentByInviteId(inviteId)


        assertThat(result).isEqualTo(expectedDTO)
        verify { inviteRepository.findById(inviteId) }
        verify { assessmentReadConverter.toDTO(assessment) }
    }


    @Test
    fun `test getPreInfoByInviteId() throws an NoSuchElementException when invite can't be found`() {
        val inviteId = UUID.randomUUID()

        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteReadService.getPreInfoByInviteId(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invite not found for the preInfo")
    }

    @Test
    fun `test getPreInfoByInviteId() returns converted preInfo`() {
        val inviteId = UUID.randomUUID()
        val invite = mockk<Invite>()
        val expectedDTO = mockk<PreInfoReadDTO>()

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { preInfoReadConverter.toDTO(invite) } returns expectedDTO

        val result = inviteReadService.getPreInfoByInviteId(inviteId)

        assertThat(result).isEqualTo(expectedDTO)
        verify { inviteRepository.findById(inviteId) }
        verify { preInfoReadConverter.toDTO(invite) }
    }


    @Test
    fun `test startAssessment() when assessmentStarted is null the invite is updated`() {
        val invite = Invite(
            id = UUID.randomUUID(),
            assessmentStartedAt = null,
            measuredSecondsPerSection = mutableListOf(TimingPerSection()),
            status = InviteStatus.not_started
        )

        every { inviteRepository.findById(invite.id) } returns Optional.of(invite)

        val inviteSlot = slot<Invite>()
        every { inviteRepository.save(capture(inviteSlot)) } answers { inviteSlot.captured }

        inviteReadService.startAssessment(invite.id)

        assertThat(invite.assessmentStartedAt).isNotNull
        assertThat(invite.measuredSecondsPerSection.first().visitedAt).isNotNull
        assertThat(invite.status).isEqualTo(InviteStatus.app_started)

        verify { inviteRepository.save(invite) }
    }

    @Test
    fun `test startAssessment() when assessmentStarted is not null that the data is not changed`() {
        val existingStartTime = OffsetDateTime.now().minusDays(1)
        val invite = mockk<Invite>(relaxUnitFun = true) {
            every { assessmentStartedAt } returns existingStartTime
            every { measuredSecondsPerSection } returns mutableListOf(mockk(relaxed = true))
        }

        every { inviteRepository.findById(invite.id) } returns Optional.of(invite)

        inviteReadService.startAssessment(invite.id)

        assertThat(invite.assessmentStartedAt).isEqualTo(existingStartTime)
        verify(exactly = 0) { inviteRepository.save(any()) }
    }


    @Test
    fun `test checkAccessibilityAssessment() throws an NoSuchElementException when invite can't be found`() {
        val inviteId = UUID.randomUUID()

        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invite not found")
    }

    @Test
    fun `test checkAccessibilityAssessment() throws an UnauthorizedException when invite status is app_finished`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.app_finished,
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<UnauthorizedException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Not authorized to retrieve assessment, invite has been finished")
    }

    @Test
    fun `test checkAccessibilityAssessment() throws an UnauthorizedException when invite is expired (status)`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.expired,
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<UnauthorizedException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Not authorized to retrieve assessment, invitation has been expired")
    }

    @Test
    fun `test checkAccessibilityAssessment() throws an UnauthorizedException when invite is expired (expiresAt)`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            expiresAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).minusNanos(1),
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<UnauthorizedException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Not authorized to retrieve assessment, invitation has been expired")
    }

    @Test
    fun `test checkAccessibilityAssessment() throws an UnauthorizedException when invite is expired (status and expiresAt)`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.expired,
            expiresAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).minusNanos(1),
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<UnauthorizedException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Not authorized to retrieve assessment, invitation has been expired")
    }

    @Test
    fun `test checkAccessibilityAssessment() throws an UnauthorizedException when invite is cancelled`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.cancelled,
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<UnauthorizedException> {
            inviteReadService.checkAccessibilityAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Not authorized to retrieve assessment, invitation has been cancelled")
    }

    @Test
    fun `test checkTimingAssessment() throws an NoSuchElementException when the invite couldn't be found`() {
        val inviteId = UUID.randomUUID()

        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            inviteReadService.checkTimingAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("No invite with id $inviteId")
    }

    @Test
    fun `test checkTimingAssessment() throws an IllegalStateException when the assessmentStartedAt is null after starting it`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.app_started,
            measuredSecondsPerSection = mutableListOf(TimingPerSection()),
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val inviteSlot = slot<Invite>()
        every { inviteRepository.save(capture(inviteSlot)) } answers {
            inviteSlot.captured.assessmentStartedAt = null
            inviteSlot.captured
        }

        val exception = assertThrows<IllegalStateException> {
            inviteReadService.checkTimingAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Assessment start time is not set")
    }

    @Test
    fun `test checkTimingAssessment() throws an IllegalStateException when the availableSeconds of the assessment is null`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.app_started,
            measuredSecondsPerSection = mutableListOf(TimingPerSection()),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val inviteSlot = slot<Invite>()
        every { inviteRepository.save(capture(inviteSlot)) } answers {
            inviteSlot.captured.assessmentStartedAt = invite.assessmentStartedAt
            inviteSlot.captured
        }

        val exception = assertThrows<IllegalStateException> {
            inviteReadService.checkTimingAssessment(inviteId)
        }
        assertThat(exception.message).isEqualTo("Available time for the assessment is not set")
    }

    @Test
    fun `test checkTimingAssessment() when spent time surpasses the available time the finished process is started`() {
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            status = InviteStatus.app_started,
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).minusSeconds(500),
            measuredSecondsPerSection = mutableListOf(TimingPerSection()),
            assessment = Assessment(
                id = 1L,
                sections = mutableListOf(
                    Section(
                        assignments = mutableListOf(
                            Assignment(availableSeconds = 100),
                            Assignment(availableSeconds = 100)
                        )
                    )
                )
            )
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(inviteId, any<OffsetDateTime>()) } returns TimingPerSection()
        every { timingPerSectionRepository.save(any<TimingPerSection>()) } answers { firstArg() }
        every { inviteRepository.save(any<Invite>()) } answers {
            firstArg<Invite>().apply {
                status = InviteStatus.app_finished
                assessmentFinishedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
            }
        }

        val exception = assertThrows<AssessmentTimeExceededException> {
            inviteReadService.checkTimingAssessment(inviteId)
        }

        assertThat(invite.status).isEqualTo(InviteStatus.app_finished)
        assertThat(invite.assessmentFinishedAt).isNotNull()
        assertThat(exception.message).isEqualTo("Assessment time exceeded for invite ID: $inviteId")
    }


    @Test
    fun `test getAllToBeFinishedInvites() should return empty list when no invites exist`() {
        every { inviteRepository.findAll(any<Specification<Invite?>>()) } returns emptyList()

        val result = inviteReadService.getAllToBeFinishedInvites()

        assertThat(result).isEmpty()
    }

    @Test
    fun `test getAllToBeFinishedInvites() should return invites that need to be finished`() {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            assessmentStartedAt = now.minusSeconds(3600),
            assessment = mockk { every { availableSeconds } returns 1800 },
            assessmentFinishedAt = null
        )
        val inviteDTO = InviteReadDTO(
            id = inviteId, applicantId = 1L,
            assessmentId = 1L,
            status = InviteStatus.app_started,
            invitedAt = OffsetDateTime.now(ZoneOffset.UTC).minusDays(3),
            expiresAt = OffsetDateTime.now(ZoneOffset.UTC).plusDays(4),
            measuredSecondsPerSection = listOf(0, 0),
            assessmentStartedAt = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1800),
            assessmentFinishedAt = null,
            scoredPoints = 40,
            availablePoints = 50
        )

        every { inviteRepository.findAll(any<Specification<Invite?>>()) } returns listOf(invite)
        every { inviteReadConverter.toDTO(invite) } returns inviteDTO

        val result = inviteReadService.getAllToBeFinishedInvites()

        assertThat(result).containsExactly(inviteDTO)
    }

    @Test
    fun `test getAllToBeFinishedInvites() should exclude invites that are still active`() {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val invite = Invite(
            id = UUID.randomUUID(),
            assessmentStartedAt = now.minusSeconds(900),
            assessment = mockk { every { availableSeconds } returns 1800 },
            assessmentFinishedAt = null
        )

        every { inviteRepository.findAll(any<Specification<Invite?>>()) } returns listOf(invite)

        val result = inviteReadService.getAllToBeFinishedInvites()

        assertThat(result).isEmpty()
    }

    @Test
    fun `test getAllToBeFinishedInvites() should handle invites with null assessmentStartedAt`() {
        val invite = Invite(
            id = UUID.randomUUID(),
            assessmentStartedAt = null,
            assessment = mockk { every { availableSeconds } returns 1800 },
            assessmentFinishedAt = null
        )

        every { inviteRepository.findAll(any<Specification<Invite?>>()) } returns listOf(invite)

        val result = inviteReadService.getAllToBeFinishedInvites()

        assertThat(result).isEmpty()
    }

    @Test
    fun `test getAllToBeFinishedInvites() should handle invites with availableSeconds as 0`() {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val inviteId = UUID.randomUUID()
        val invite = Invite(
            id = inviteId,
            assessmentStartedAt = now.minusSeconds(1000),
            assessment = mockk { every { availableSeconds } returns 0 },
            assessmentFinishedAt = null
        )
        val inviteDTO = InviteReadDTO(
            id = inviteId, applicantId = 1L,
            assessmentId = 1L,
            status = InviteStatus.app_started,
            invitedAt = OffsetDateTime.now(ZoneOffset.UTC).minusDays(3),
            expiresAt = OffsetDateTime.now(ZoneOffset.UTC).plusDays(4),
            measuredSecondsPerSection = listOf(0, 0),
            assessmentStartedAt = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1000),
            assessmentFinishedAt = null,
            scoredPoints = 40,
            availablePoints = 50
        )

        every { inviteRepository.findAll(any<Specification<Invite?>>()) } returns listOf(invite)
        every { inviteReadConverter.toDTO(invite) } returns inviteDTO

        val result = inviteReadService.getAllToBeFinishedInvites()

        assertThat(result).containsExactly(inviteDTO)
    }

    @Test
    fun `test  toBeFinishedQuery() should create a valid query for toBeFinishedQuery`() {
        val toBeFinishedQuery = inviteReadService.javaClass.getDeclaredMethod(
            "toBeFinishedQuery"
        )
        toBeFinishedQuery.isAccessible = true

        val spec = toBeFinishedQuery.invoke(inviteReadService) as Specification<Invite?>

        val root = mockk<Root<Invite?>>()
        val query = mockk<CriteriaQuery<*>>()
        val cb = mockk<CriteriaBuilder>()

        val combinedPredicate = mockk<Predicate>()

        every { cb.isNotNull(root.get<OffsetDateTime>("assessmentStartedAt")) } returns mockk()
        every { cb.isNull(root.get<OffsetDateTime>("assessmentFinishedAt")) } returns mockk()
        every { cb.and(cb.isNotNull(root.get<OffsetDateTime>("assessmentStartedAt")), cb.isNull(root.get<OffsetDateTime>("assessmentFinishedAt"))) } returns combinedPredicate

        val predicate = spec.toPredicate(root, query, cb)

        assertThat(predicate).isNotNull
    }
}