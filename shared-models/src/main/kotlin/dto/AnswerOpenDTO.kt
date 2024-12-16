package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class AnswerOpenDTO(
    override val assignmentId: Long,
    override val type: AssignmentDTO.AssignmentType = AssignmentDTO.AssignmentType.Open,
    val answer: String
) : AnswerDTO()