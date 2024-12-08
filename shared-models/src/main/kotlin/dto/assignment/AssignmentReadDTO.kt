package dto.assignment

import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dto.ReadDTO

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = AssignmentCodingReadDTO::class, name = "Coding"),
    JsonSubTypes.Type(value = AssignmentMultipleChoiceReadDTO::class, name = "MultipleChoice")
)
@Schema(
    description = "Either a coding or a multiple choice assignment",
    oneOf = [AssignmentCodingReadDTO::class, AssignmentMultipleChoiceReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = AssignmentCodingReadDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = AssignmentMultipleChoiceReadDTO::class),
    ]
)
sealed class AssignmentReadDTO : ReadDTO {
    @get:Schema(hidden = true)
    abstract val id: Long?

    @get:Schema(type = "string", allowableValues = ["Coding", "MultipleChoice", "Open"])
    abstract val type: AssignmentType

    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice, Open }

    abstract val description: String
}