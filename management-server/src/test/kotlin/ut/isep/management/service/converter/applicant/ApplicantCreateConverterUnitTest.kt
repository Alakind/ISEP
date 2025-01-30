package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantCreateDTO
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ApplicantCreateConverterUnitTest {

    private val converter = ApplicantCreateConverter()

    @Test
    fun `should convert ApplicantCreateDTO to Applicant`() {
        // given
        val dto = ApplicantCreateDTO(
            email = "test@example.com",
            name = "John Doe",
            preferredLanguage = "English"
        )

        // when
        val result = converter.fromDTO(dto)

        // then
        assertEquals(0, result.id)
        assertEquals(dto.email, result.email)
        assertEquals(dto.name, result.name)
        assertEquals(dto.preferredLanguage, result.preferredLanguage)
    }
}