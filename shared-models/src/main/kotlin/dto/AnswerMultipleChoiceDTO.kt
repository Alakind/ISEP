package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class AnswerMultipleChoiceDTO(
    override val assignmentId: Long,
    override val type: AssignmentDTO.AssignmentType = AssignmentDTO.AssignmentType.MultipleChoice,
    val answer: List<Int>
) : AnswerDTO()