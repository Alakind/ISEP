package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

@Schema(description = "An applicant")
data class ApplicantDTO(
    val id: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),
    val status: ApplicantStatus = ApplicantStatus.not_started,
    val preferredLanguage: String? = null,
)