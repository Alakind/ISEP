package dto.assessment

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class AssessmentReadDTO(
    val id: Long,
    val tag: String,
    val commit: String,
    val availableSeconds: Long,
    val sections: List<Long>
) : ReadDTO