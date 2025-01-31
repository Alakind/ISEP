package ut.isep.management.service.converter.invite

import dto.invite.InviteReadDTO
import enumerable.InviteStatus
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Assessment
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.TimingPerSection
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

class InviteReadConverterUnitTest {
    private val inviteReadConverter: InviteReadConverter = mockk()

    private val applicant = mock<Applicant>()

    private val assessment = mock<Assessment>()

    private val timingPerSection1 = TimingPerSection(seconds = 60L)
    private val timingPerSection2 = TimingPerSection(seconds = 120L)

    private val inviteId = UUID.randomUUID()
    private val invite = Invite(
        id = inviteId,
        applicant = applicant,
        assessment = assessment,
        invitedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC),
        expiresAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC).plusDays(1),
        measuredSecondsPerSection = mutableListOf(
            timingPerSection1,
            timingPerSection2
        ),
        status = InviteStatus.not_started,
        assessmentStartedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC),
        assessmentFinishedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC).plusMinutes(30),
        solutions = mutableListOf()
    )

    private val inviteReadDTO = InviteReadDTO(
        id = inviteId,
        applicantId = applicant.id,
        assessmentId = assessment.id,
        status = InviteStatus.not_started,
        invitedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC),
        expiresAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC).plusDays(1),
        measuredSecondsPerSection = listOf(
            timingPerSection1.seconds,
            timingPerSection2.seconds
        ),
        assessmentStartedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC),
        assessmentFinishedAt = OffsetDateTime.of(2025, 1, 30, 10, 0, 0, 0, ZoneOffset.UTC).plusMinutes(30),
        scoredPoints = null,
        availablePoints = 0
    )

    @Test
    fun `should convert Invite to InviteReadDTO correctly`() {
        // given
        every { inviteReadConverter.toDTO((invite)) } returns inviteReadDTO

        // when
        val result = inviteReadConverter.toDTO(invite)

        // then
        assertEquals(invite.id, result.id)
        assertEquals(invite.applicant!!.id, result.applicantId)
        assertEquals(invite.assessment!!.id, result.assessmentId)
        assertEquals(invite.invitedAt, result.invitedAt)
        assertEquals(invite.expiresAt, result.expiresAt)
        assertEquals(60, result.measuredSecondsPerSection[0])
        assertEquals(120, result.measuredSecondsPerSection[1])
        assertEquals(invite.status, result.status)
        assertEquals(invite.assessmentStartedAt, result.assessmentStartedAt)
        assertEquals(invite.assessmentFinishedAt, result.assessmentFinishedAt)
        assertNull(result.scoredPoints)
        assertEquals(invite.assessment!!.availablePoints, result.availablePoints)
    }
}