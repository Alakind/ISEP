package dto

import enumerable.UserRole
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A create/read DTO for a user")
data class UserCreateReadDTO(
    val id: Long = 0,
    val name: String = "",
    val email: String = "",
    val role: UserRole? = null
)