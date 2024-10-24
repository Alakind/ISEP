package models

import com.fasterxml.jackson.annotation.JsonSubTypes
import io.swagger.v3.oas.annotations.media.Schema

@JsonSubTypes(value = [
    JsonSubTypes.Type(value = AssignmentCoding::class),
    JsonSubTypes.Type(value = AssignmentMultipleChoice::class)
    ]
)
@Schema(
    description = "Either a coding or a multiple choice assignment"
)
sealed class Assignment