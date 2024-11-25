package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An applicant")
data class ApplicantCreateReadDTO(
    val id: Long = 0,
    val status: ApplicantStatus = ApplicantStatus.not_started,
    val preferredLanguage: String? = null
)