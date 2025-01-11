package dto.assignment

import dto.UpdateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An result assignment")
data class ResultAssignmentUpdateDTO(
    override val id: String,
    val scoredPoints: Int?,
) : UpdateDTO<String>