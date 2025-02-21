package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved open assignment")
data class SolvedAssignmentOpenReadDTO(
    override val id: Long,
    override val description: String,
    override val answer: AnswerCreateReadDTO.Open,
) : SolvedAssignmentReadDTO {
    override val type: BaseAssignment.AssignmentType = BaseAssignment.AssignmentType.Open
}
