package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class AnswerOpenDTO(
    override val id: Long?,
    override val type: AssignmentDTO.AssignmentType = AssignmentDTO.AssignmentType.Open,
    val questionId: Long,
    val answer: String
) : AnswerDTO()