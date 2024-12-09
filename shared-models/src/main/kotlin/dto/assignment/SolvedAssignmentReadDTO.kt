package dto.assignment

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dto.ReadDTO
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = SolvedAssignmentCodingReadDTO::class, name = "Coding"),
    JsonSubTypes.Type(value = SolvedAssignmentMultipleChoiceReadDTO::class, name = "MultipleChoice"),
    JsonSubTypes.Type(value = SolvedAssignmentOpenReadDTO::class, name = "Open")
)
@Schema(
    description = "A solved assignment with an answer",
    oneOf = [SolvedAssignmentCodingReadDTO::class, SolvedAssignmentMultipleChoiceReadDTO::class, SolvedAssignmentOpenReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = SolvedAssignmentCodingReadDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = SolvedAssignmentMultipleChoiceReadDTO::class),
        DiscriminatorMapping(value = "Open", schema = SolvedAssignmentOpenReadDTO::class),
    ]
)
sealed class SolvedAssignmentReadDTO : ReadDTO {
    abstract val id: Long
    abstract val type: AssignmentReadDTO.AssignmentType
    abstract val description: String
    abstract val answer: AnswerCreateReadDTO
}