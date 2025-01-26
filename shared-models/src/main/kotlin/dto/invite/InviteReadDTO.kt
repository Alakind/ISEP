package dto.invite

import dto.ReadDTO
import enumerable.InviteStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime
import java.util.*

@Schema(description = "An invite to an applicant")
data class InviteReadDTO(
    val id: UUID,
    val applicantId: Long,
    val assessmentId: Long,
    val status: InviteStatus,
    val invitedAt: OffsetDateTime,
    val expiresAt: OffsetDateTime,
    val measuredSecondsPerSection: List<Long>,
    val assessmentStartedAt: OffsetDateTime? = null,
    val assessmentFinishedAt: OffsetDateTime? = null,
    val scoredPoints: Int?,
    val availablePoints: Int?,
) : ReadDTO