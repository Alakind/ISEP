package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Answers")
data class AnswerSectionDTO (
    val id: Long?,
    val sectionId: Long,
    val answers: List<AnswerDTO>
) {
    constructor(): this(null, 0, emptyList())
}