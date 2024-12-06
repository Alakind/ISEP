package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "DTO for creating an Applicant")
data class ApplicantCreateReadDTO(
    val id: Long = 0,
    val name: String = "",
    val status: ApplicantStatus = ApplicantStatus.not_started,
    val preferredLanguage: String? = null,
    val score: Int? = 0,
    val invite: InviteCreateDTO? = null
)