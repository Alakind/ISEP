package dto.invite

import dto.CreateDTO
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "An invite to an applicant")
data class InviteCreateDTO(
    val applicantId: Long,
    val assessmentId: Long,
    val expiresAt: OffsetDateTime?
) : CreateDTO