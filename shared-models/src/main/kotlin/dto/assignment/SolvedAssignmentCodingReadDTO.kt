package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved coding assignment")
data class SolvedAssignmentCodingReadDTO(
    override val id: Long,
    override val description: String,
    val language: String,
    val startCode: String,
    val startTest: String,
    override val answer: AnswerCreateReadDTO.Coding,
) : SolvedAssignmentReadDTO {
    override val type: BaseAssignment.AssignmentType = BaseAssignment.AssignmentType.Coding
}
