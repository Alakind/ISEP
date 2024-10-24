package models

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "A multiple choice assignment")
data class AssignmentMultipleChoice(
    val id: Int,
    val text: List<String>,
    val isMultipleAnswers: Boolean,
    val options: List<String>
) : Assignment()