package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class AnswerMultipleChoiceDTO(
    override val id: Long?,
    override val type: AssignmentDTO.AssignmentType = AssignmentDTO.AssignmentType.MultipleChoice,
    val questionId: Long,
    val answer: List<Int>
) : AnswerDTO()