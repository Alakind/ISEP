package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Paginated list of users")
data class UsersPaginatedDTO (
    val total: Long,
    val users: List<UserCreateReadDTO>,
)