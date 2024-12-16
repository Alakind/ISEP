package dto

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "Multiple choice assignment")
data class AssignmentMultipleChoiceDTO(
    override val id: Long?,
    override val type: AssignmentType = AssignmentType.MultipleChoice,
    val description: String,
    val options: List<String>,
    val isMultipleAnswers: Boolean,
    val answer: List<Int>?
) : AssignmentDTO()
