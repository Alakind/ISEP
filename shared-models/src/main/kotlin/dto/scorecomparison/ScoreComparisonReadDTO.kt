package dto.scorecomparison

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Score comparison DTO")
data class ScoreComparisonReadDTO(
    val percentage: Float, //percentage how much better than the others
    val distributionGroups: List<Float>, // 10 groups
    val selectedGroup: Int, // the distribution group for this percentage
) : ReadDTO