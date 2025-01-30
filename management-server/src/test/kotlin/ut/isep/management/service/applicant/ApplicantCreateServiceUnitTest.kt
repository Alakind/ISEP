package ut.isep.management.service.applicant

import dto.applicant.ApplicantCreateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.converter.applicant.ApplicantCreateConverter

class ApplicantCreateServiceUnitTest {
    private val applicantRepository: ApplicantRepository = mockk()
    private val applicantCreateConverter: ApplicantCreateConverter = mockk()
    private val applicantCreateService = ApplicantCreateService(applicantRepository, applicantCreateConverter);

    private val applicantCreateDTO = ApplicantCreateDTO(name = "John Doe", email = "john@example.com")
    private val applicant = Applicant(id = 1L, name = "John Doe", email = "john@example.com")

    @Test
    fun whenCreateApplicant_thenReturnApplicant() {
        // given
        every { applicantCreateConverter.fromDTO(applicantCreateDTO) } returns applicant
        every { applicantRepository.save(applicant) } returns applicant

        // when
        val result = applicantCreateService.create(applicantCreateDTO)

        // then
        verify(exactly = 1) { applicantCreateConverter.fromDTO(applicantCreateDTO) }
        verify(exactly = 1) { applicantRepository.save(applicant) }
        assertThat(result).isEqualTo(applicant)
    }
}