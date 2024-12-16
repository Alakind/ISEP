package dto.applicant

import dto.CreateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantCreateDTO(
    val id: Long = 0,
    val name: String = "",
    val email: String = "",
    val preferredLanguage: String = "",
) : CreateDTO