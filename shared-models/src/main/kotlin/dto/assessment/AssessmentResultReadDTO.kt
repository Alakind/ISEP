package dto.assessment

import dto.ReadDTO
import dto.section.ResultSectionReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class AssessmentResultReadDTO(
    val id: Long,
    val tag: String,
    val sections: List<ResultSectionReadDTO>
) : ReadDTO