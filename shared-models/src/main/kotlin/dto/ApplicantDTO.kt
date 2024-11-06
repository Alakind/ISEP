package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantDTO(
    val id: Long? = null,
    val status: ApplicantStatus = ApplicantStatus.not_started,
    val preferredLanguage: String? = null,
)