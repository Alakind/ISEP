package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An invite to an applicant")
data class InviteCreateReadDTO(
    val applicantId: Long,
    val assessmentId: Long
)