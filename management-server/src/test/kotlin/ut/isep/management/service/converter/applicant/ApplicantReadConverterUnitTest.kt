package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import java.time.OffsetDateTime
import java.util.*

class ApplicantReadConverterUnitTest {
    private val applicantReadConverter: ApplicantReadConverter = mockk()

    private val inviteId1 = UUID.randomUUID()
    private val inviteId2 = UUID.randomUUID()
    private val invite1: Invite = Invite(inviteId1)
    private val invite2: Invite = Invite(inviteId1)
    private val applicantReadDTO = ApplicantReadDTO(
        id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = "Kotlin", invites = listOf(inviteId1, inviteId2), createdAt =
            OffsetDateTime.now()
    )
    private val applicant = Applicant(
        id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = "Kotlin", invites = mutableListOf(invite1, invite2), createdAt =
            OffsetDateTime.now()
    )

    @Test
    fun whenReadApplicant_thenReturnApplicant() {
        // given
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO

        // when
        val result = applicantReadConverter.toDTO(applicant)

        // then
        verify(exactly = 1) { applicantReadConverter.toDTO(applicant) }
        assertThat(result).isEqualTo(applicantReadDTO)
    }
}