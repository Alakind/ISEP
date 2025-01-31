package dto.user

import dto.UpdateDTO
import enumerable.UserRole
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An update DTO for a user")
data class UserUpdateDTO(
    override val id: Long,
    val name: String? = null,
    val oid: String? = null,
    val email: String? = null,
    val role: UserRole? = null
) : UpdateDTO<Long>