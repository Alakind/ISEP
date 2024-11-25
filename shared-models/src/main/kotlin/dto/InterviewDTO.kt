package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class InterviewDTO(
    val id: Long?,
    val sections: List<Long>
) {
    constructor(): this(null, emptyList())
}