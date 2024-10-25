package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class QuestionnaireDTO(
    val id: Int?,
    val sections: List<SectionDTO>
)