package dto.applicant

import dto.UpdateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantUpdateDTO(
    override val id: Long = 0,
    val name: String?,
    val email: String?,
    val preferredLanguage: String?,
) : UpdateDTO<Long>