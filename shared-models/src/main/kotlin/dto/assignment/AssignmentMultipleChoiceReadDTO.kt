package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Multiple choice assignment")
data class AssignmentMultipleChoiceReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    val options: List<String>,
    val isMultipleAnswers: Boolean,
): BaseAssignment(), AssignmentReadDTO {
    override val type: AssignmentType = AssignmentType.MultipleChoice
}
