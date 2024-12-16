package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class AssessmentDTO(
    val id: Long,
    val sections: List<SectionDTO>
) {
    constructor(): this(0, emptyList())
}