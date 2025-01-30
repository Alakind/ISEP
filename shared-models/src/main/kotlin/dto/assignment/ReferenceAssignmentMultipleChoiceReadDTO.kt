package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class ReferenceAssignmentMultipleChoiceReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    override val availableSeconds: Long,
    override val referenceAnswer: AnswerCreateReadDTO.MultipleChoice,
    val options: List<String>,
) : BaseAssignment(), ReferenceAssignmentReadDTO {
    override val type: AssignmentType = AssignmentType.MultipleChoice
}
