package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantUpdateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.applicant.ApplicantUpdateService
import java.util.*

class ApplicantUpdateConverterUnitTest {
    private val applicantRepository: ApplicantRepository = mockk()
    private val applicantUpdateConverter: ApplicantUpdateConverter = mockk()
    private val applicantUpdateService = ApplicantUpdateService(applicantRepository, applicantUpdateConverter);

    private val applicantUpdateDTO = ApplicantUpdateDTO(id = 1L, name = "John Doe", email = "john.doe@example.com", preferredLanguage = "Kotlin")
    private val applicant = Applicant(id = 1L, name = "John Doe", email = "john@example.com")

    @Test
    fun whenUpdateApplicant_thenReturnApplicant() {
        // given
        every { applicantUpdateConverter.updateEntity(applicant, applicantUpdateDTO) } returns applicant
        every { applicantRepository.save(applicant) } returns applicant
        every { applicantRepository.findById(applicant.id) } returns Optional.of(applicant)

        // when
        val result = applicantUpdateService.update(applicantUpdateDTO)

        // then
        verify(exactly = 1) { applicantUpdateConverter.updateEntity(applicant, applicantUpdateDTO) }
        verify(exactly = 1) { applicantRepository.save(applicant) }
        assertThat(result).isEqualTo(applicant)
    }
}