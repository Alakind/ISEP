package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantUpdateDTO(
    val id: Long = 0,
    val name: String? = null,
    val email: String? = null,
    val status: ApplicantStatus? = null,
    val preferredLanguage: String? = null,
    val score: Int? = null
)