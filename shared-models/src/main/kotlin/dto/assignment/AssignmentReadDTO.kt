package dto.assignment

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "An assignment",
    oneOf = [AssignmentCodingReadDTO::class, AssignmentMultipleChoiceReadDTO::class, AssignmentOpenReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = AssignmentCodingReadDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = AssignmentMultipleChoiceReadDTO::class),
        DiscriminatorMapping(value = "Open", schema = AssignmentOpenReadDTO::class)
    ]
)
sealed interface AssignmentReadDTO : ReadDTO
