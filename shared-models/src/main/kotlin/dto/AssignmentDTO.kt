package dto

import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Either a coding or a multiple choice assignment",
    oneOf = [AssignmentCodingDTO::class, AssignmentMultipleChoiceDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = AssignmentCodingDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = AssignmentMultipleChoiceDTO::class),
    ]
)
sealed class AssignmentDTO() {
    @get:Schema(hidden = true)
    abstract val id: Int

    @get:Schema(hidden = true)
    abstract val type: AssignmentType

    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice }
}

