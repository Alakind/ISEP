package models

import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Either a coding or a multiple choice assignment",
    oneOf = [AssignmentCoding::class, AssignmentMultipleChoice::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = AssignmentCoding::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = AssignmentMultipleChoice::class),
    ]
)
sealed class Assignment() {
    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice }
}

