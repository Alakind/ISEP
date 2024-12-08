package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "Multiple choice assignment")
data class AssignmentOpenReadDTO(
    override val id: Long?,
    override val type: AssignmentType = AssignmentType.Open,
    override val description: String
) : AssignmentReadDTO()