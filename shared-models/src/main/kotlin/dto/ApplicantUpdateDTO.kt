package dto

import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

@Schema(description = "An applicant")
data class ApplicantUpdateDTO(
    val id: UUID,
    val status: ApplicantStatus? = null,
    val preferredLanguage: String? = null,
)