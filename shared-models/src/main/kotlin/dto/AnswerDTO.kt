package dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = AnswerOpenDTO::class, name = "Open"),
    JsonSubTypes.Type(value = AnswerMultipleChoiceDTO::class, name = "MultipleChoice"),
)
@Schema(
    description = "Either an open or a multiple choice answer",
    oneOf = [AnswerOpenDTO::class, AnswerMultipleChoiceDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Open", schema = AnswerOpenDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = AnswerMultipleChoiceDTO::class),
    ]
)
sealed class AnswerDTO {
    @get:Schema(hidden = true)
    abstract val assignmentId: Long

    @get:Schema(type = "string", allowableValues = ["MultipleChoice", "Open"])
    abstract val type: AssignmentDTO.AssignmentType
}