package dto.user

import dto.CreateDTO
import enumerable.UserRole
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A create/read DTO for a user")
data class UserCreateDTO(
    val name: String = "",
    val oid: String = "",
    val email: String = "",
    val role: UserRole? = null
) : CreateDTO