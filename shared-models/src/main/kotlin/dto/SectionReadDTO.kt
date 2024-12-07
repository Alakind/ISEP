package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Assignments")
data class SectionReadDTO (
    val id: Long?,
    val title: String,
    val assignments: List<AssignmentDTO>
) : ReadDTO