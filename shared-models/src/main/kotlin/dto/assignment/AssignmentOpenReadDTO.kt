package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Open assignment")
data class AssignmentOpenReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    override val availableSeconds: Long,
) : BaseAssignment(), AssignmentReadDTO {
    override val type: AssignmentType = AssignmentType.Open
}
