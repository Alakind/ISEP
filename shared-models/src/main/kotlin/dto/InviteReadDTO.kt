package dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.ZonedDateTime
import java.util.*

@Schema(description = "An invite to an applicant")
data class InviteReadDTO(
    val id: UUID,
    val applicantId: Long,
    val assessmentId: Long,
    val invitedAt: ZonedDateTime
)