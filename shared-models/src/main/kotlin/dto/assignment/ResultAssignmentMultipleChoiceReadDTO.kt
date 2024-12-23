package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A multiple-choice assignment complete with user solution and reference answer")
data class ResultAssignmentMultipleChoiceReadDTO(
    @field: JsonUnwrapped
    val baseAssignment: AssignmentMultipleChoiceReadDTO,
    override val userAnswer: AnswerCreateReadDTO.MultipleChoice,
    override val referenceAnswer: AnswerCreateReadDTO.MultipleChoice
) : ResultAssignmentReadDTO
