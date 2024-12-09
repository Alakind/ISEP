package dto.solution

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import io.swagger.v3.oas.annotations.media.Schema
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import dto.CreateDTO
import dto.ReadDTO

@Schema(description = "Answer objects for open, multiple-choice, and coding questions")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = AnswerCreateReadDTO.MultipleChoice::class, name = "MultipleChoice"),
    JsonSubTypes.Type(value = AnswerCreateReadDTO.Open::class, name = "Open"),
    JsonSubTypes.Type(value = AnswerCreateReadDTO.Coding::class, name = "Coding")
)
sealed class AnswerCreateReadDTO : CreateDTO, ReadDTO {

    data class MultipleChoice @JsonCreator constructor(
        @JsonProperty("answer") val answer: List<Int>
    ) : AnswerCreateReadDTO()

    data class Open @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : AnswerCreateReadDTO()

    data class Coding @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : AnswerCreateReadDTO()
}
