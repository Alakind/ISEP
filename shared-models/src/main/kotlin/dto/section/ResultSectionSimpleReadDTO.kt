package dto.section

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Simple overview of the points scored in a section")
data class ResultSectionSimpleReadDTO(
    val title: String,
    val availablePoints: Int,
    val scoredPoints: Int?,
    val availableSeconds: Long,
    val measuredSeconds: Long?,
)

