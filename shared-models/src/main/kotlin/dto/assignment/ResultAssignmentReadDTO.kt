package dto.assignment

import dto.ReadDTO
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "An assignment complete with user solution and reference answer",
    oneOf = [ResultAssignmentCodingReadDTO::class, ResultAssignmentMultipleChoiceReadDTO::class, ResultAssignmentOpenReadDTO::class],
    discriminatorProperty = "type",
    discriminatorMapping = [
        DiscriminatorMapping(value = "Coding", schema = ResultAssignmentCodingReadDTO::class),
        DiscriminatorMapping(value = "MultipleChoice", schema = ResultAssignmentMultipleChoiceReadDTO::class),
        DiscriminatorMapping(value = "Open", schema = ResultAssignmentOpenReadDTO::class)
    ]
)
sealed interface ResultAssignmentReadDTO : ReadDTO {
    val solvedAssignment: SolvedAssignmentReadDTO
    val scoredPoints: Int
    val referenceAnswer: AnswerCreateReadDTO
}
