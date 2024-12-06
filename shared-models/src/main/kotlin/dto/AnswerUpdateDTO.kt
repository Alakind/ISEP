package dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import io.swagger.v3.oas.annotations.media.Schema
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

@Schema(description = "Answer objects for open, multiple-choice, and coding questions")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = AnswerUpdateDTO.MultipleChoiceAnswer::class, name = "MultipleChoice"),
    JsonSubTypes.Type(value = AnswerUpdateDTO.OpenAnswer::class, name = "Open"),
    JsonSubTypes.Type(value = AnswerUpdateDTO.CodingAnswer::class, name = "Coding")
)
sealed class AnswerUpdateDTO {

    data class MultipleChoiceAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: List<Int>
    ) : AnswerUpdateDTO()

    data class OpenAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : AnswerUpdateDTO()

    data class CodingAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : AnswerUpdateDTO()
}
