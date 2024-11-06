package dto

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "Multiple choice assignment")
data class AssignmentOpenDTO(
    override val id: Long?,
    override val type: AssignmentType = AssignmentType.Open,
    val description: List<String>
) : AssignmentDTO()
