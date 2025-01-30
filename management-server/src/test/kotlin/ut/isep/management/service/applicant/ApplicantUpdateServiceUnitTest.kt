package ut.isep.management.service.applicant

import dto.applicant.ApplicantUpdateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.converter.UpdateConverter
import java.util.*

class ApplicantUpdateServiceUnitTest {
    private val applicantRepository: JpaRepository<Applicant, Long> = mockk()
    private val applicantUpdateConverter: UpdateConverter<Applicant, ApplicantUpdateDTO> = mockk()
    private val applicantUpdateService = ApplicantUpdateService(applicantRepository, applicantUpdateConverter)

    private val applicant = Applicant(id = 1L, name = "John Doe", email = "john@example.com")
    private val updatedApplicant = Applicant(id = 1L, name = "John Doe", email = "john.doe@example.com")
    private val applicantUpdateDTO = ApplicantUpdateDTO(id = 1L, name = "John Doe", email = "john.doe@example.com", preferredLanguage = "Kotlin")

    @Test
    fun whenUpdateApplicant_thenUpdateEntity() {
        // given
        every { applicantRepository.findById(1L) } returns Optional.of(applicant)
        every { applicantUpdateConverter.updateEntity(applicant, applicantUpdateDTO) } returns updatedApplicant
        every { applicantRepository.save(updatedApplicant) } returns updatedApplicant

        // when
        val result = applicantUpdateService.update(applicantUpdateDTO)

        // then
        verify(exactly = 1) { applicantRepository.findById(1L) }
        verify(exactly = 1) { applicantUpdateConverter.updateEntity(applicant, applicantUpdateDTO) }
        verify(exactly = 1) { applicantRepository.save(updatedApplicant) }
        assertThat(result).isEqualTo(updatedApplicant)
    }
}