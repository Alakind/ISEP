package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Answers")
data class AnswerSectionDTO (
    val sectionId: Int,
    val answers: List<AnswerDTO>
) {
    constructor(): this(0, emptyList())
}