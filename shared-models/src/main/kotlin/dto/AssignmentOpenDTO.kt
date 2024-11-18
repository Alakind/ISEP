package dto

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "Multiple choice assignment")
data class AssignmentOpenDTO(
    override val id: Long?,
    override val type: AssignmentType = AssignmentType.Open,
    override val description: String
) : AssignmentDTO()
