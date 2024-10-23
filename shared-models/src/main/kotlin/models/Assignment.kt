package models

import com.fasterxml.jackson.annotation.JsonSubTypes
import io.swagger.v3.oas.annotations.media.Schema

@JsonSubTypes(value = [
    JsonSubTypes.Type(value = AssignmentCoding::class),
    JsonSubTypes.Type(value = AssignmentMultipleChoice::class)
    ]
)
@Schema(
    oneOf = [AssignmentCoding::class, AssignmentMultipleChoice::class]
)
sealed class Assignment