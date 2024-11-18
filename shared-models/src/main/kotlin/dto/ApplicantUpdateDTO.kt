package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantUpdateDTO(
    val id: Long,
    val status: ApplicantStatus? = null,
    val preferredLanguage: String? = null,
)