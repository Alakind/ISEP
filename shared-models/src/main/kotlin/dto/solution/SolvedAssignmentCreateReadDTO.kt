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
    JsonSubTypes.Type(value = SolvedAssignmentCreateReadDTO.MultipleChoiceAnswer::class, name = "MultipleChoice"),
    JsonSubTypes.Type(value = SolvedAssignmentCreateReadDTO.OpenAnswer::class, name = "Open"),
    JsonSubTypes.Type(value = SolvedAssignmentCreateReadDTO.CodingAnswer::class, name = "Coding")
)
sealed class SolvedAssignmentCreateReadDTO : CreateDTO, ReadDTO {

    data class MultipleChoiceAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: List<Int>
    ) : SolvedAssignmentCreateReadDTO()

    data class OpenAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : SolvedAssignmentCreateReadDTO()

    data class CodingAnswer @JsonCreator constructor(
        @JsonProperty("answer") val answer: String
    ) : SolvedAssignmentCreateReadDTO()
}
