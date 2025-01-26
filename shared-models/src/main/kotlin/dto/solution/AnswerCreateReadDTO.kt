package dto.solution

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dto.CreateDTO
import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Answer objects for open, multiple-choice, and coding questions")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = AnswerCreateReadDTO.MultipleChoice::class, name = "MultipleChoice"),
    JsonSubTypes.Type(value = AnswerCreateReadDTO.Open::class, name = "Open"),
    JsonSubTypes.Type(value = AnswerCreateReadDTO.Coding::class, name = "Coding")
)
// TODO check if removing @JsonSubTypes breaks communication w/ front end. Remove if possible because
//  the type property is redundant in all cases
sealed class AnswerCreateReadDTO : CreateDTO, ReadDTO {

    data class MultipleChoice @JsonCreator constructor(
        @JsonProperty("answer") val answer: List<Int>
    ) : AnswerCreateReadDTO()

    data class Open @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : AnswerCreateReadDTO()

    data class Coding @JsonCreator constructor(
        @JsonProperty("code") val code: String,
        @JsonProperty("test") val test: String
    ) : AnswerCreateReadDTO()
}
