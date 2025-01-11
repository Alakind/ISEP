package dto.invite

import dto.UpdateDTO
import enumerable.InviteStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime
import java.util.*

@Schema(description = "An invite")
data class InviteUpdateDTO(
    override val id: UUID,
    val status: InviteStatus?,
    val expiresAt: OffsetDateTime?
) : UpdateDTO<UUID>