package models

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Assignments")
data class Section (
    val title: String,
    val assignments: List<Assignment>
)