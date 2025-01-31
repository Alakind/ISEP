package dto.section

import io.swagger.v3.oas.annotations.media.Schema

data class SectionInfo(
    @Schema(description = "section ID")
    val id: Long,
    @Schema(description = "section title")
    val title: String,
    @Schema(description = "total points available in this section")
    val availablePoints: Int,
    @Schema(description = "total time available for this section")
    val availableSeconds: Long,
)
