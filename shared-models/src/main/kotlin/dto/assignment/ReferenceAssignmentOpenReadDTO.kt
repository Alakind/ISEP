package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Open assignment")
data class ReferenceAssignmentOpenReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    override val availableSeconds: Long,
    override val referenceAnswer: AnswerCreateReadDTO.Open,
) : BaseAssignment(), ReferenceAssignmentReadDTO {
    override val type: AssignmentType = AssignmentType.Open
}
