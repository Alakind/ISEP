package dto.user

import dto.ReadDTO
import enumerable.UserRole
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "A create/read DTO for a user")
data class UserReadDTO(
    val id: Long = 0,
    val name: String = "",
    val oid: String = "",
    val email: String = "",
    val role: UserRole? = null,
    val createdAt: OffsetDateTime,
) : ReadDTO