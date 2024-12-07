package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Response class for paginated requests")
data class PaginatedDTO<ReadDTO>(val total: Long, val data: List<ReadDTO>)