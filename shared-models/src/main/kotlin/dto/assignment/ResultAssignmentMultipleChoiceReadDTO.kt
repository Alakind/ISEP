package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A multiple-choice assignment complete with user solution and reference answer")
data class ResultAssignmentMultipleChoiceReadDTO(
    @field: JsonUnwrapped
    override val solvedAssignment: SolvedAssignmentMultipleChoiceReadDTO,
    override val referenceAnswer: AnswerCreateReadDTO.MultipleChoice,
    override val scoredPoints: Int?,
    override val measuredSeconds: Long?
) : ResultAssignmentReadDTO
