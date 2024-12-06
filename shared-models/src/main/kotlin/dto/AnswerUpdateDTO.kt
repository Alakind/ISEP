package dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Answer objects for open, multiple-choice, and coding questions")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = AnswerUpdateDTO.MultipleChoiceAnswer::class, name = "MultipleChoiceAnswer"),
    JsonSubTypes.Type(value = AnswerUpdateDTO.OpenAnswer::class, name = "OpenAnswer"),
    JsonSubTypes.Type(value = AnswerUpdateDTO.CodingAnswer::class, name = "CodingAnswer")
)
sealed class AnswerUpdateDTO {
    data class MultipleChoiceAnswer(val answer: List<Int>) : AnswerUpdateDTO()
    data class OpenAnswer(val answer: String) : AnswerUpdateDTO()
    data class CodingAnswer(val answer: ByteArray) : AnswerUpdateDTO()
}