package dto.assignment

import dto.ReadDTO
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "A solved assignment",
    oneOf = [SolvedAssignmentCodingReadDTO::class, SolvedAssignmentMultipleChoiceReadDTO::class, SolvedAssignmentOpenReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [DiscriminatorMapping(
        value = "Coding",
        schema = SolvedAssignmentCodingReadDTO::class
    ), DiscriminatorMapping(
        value = "MultipleChoice",
        schema = SolvedAssignmentMultipleChoiceReadDTO::class
    ), DiscriminatorMapping(value = "Open", schema = SolvedAssignmentOpenReadDTO::class)]
)
sealed interface SolvedAssignmentReadDTO : ReadDTO {
    val unsolvedAssignment: AssignmentReadDTO
    val answer: AnswerCreateReadDTO
}
