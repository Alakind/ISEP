package dto.user

import enumerable.UserRole
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An update DTO for a user")
data class UserUpdateDTO(
    val id: Long,
    val name: String? = null,
    val email: String? = null,
    val role: UserRole? = null
)