package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "An assignment",
    oneOf = [ReferenceAssignmentCodingReadDTO::class, ReferenceAssignmentMultipleChoiceReadDTO::class, ReferenceAssignmentOpenReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = ReferenceAssignmentCodingReadDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = ReferenceAssignmentMultipleChoiceReadDTO::class),
        DiscriminatorMapping(value = "Open", schema = ReferenceAssignmentOpenReadDTO::class)
    ]
)
 sealed class ReferenceAssignmentReadDTO : BaseAssignment()