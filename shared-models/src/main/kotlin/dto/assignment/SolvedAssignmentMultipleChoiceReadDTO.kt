package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved multiple-choice assignment")
data class SolvedAssignmentMultipleChoiceReadDTO(
    @field: JsonUnwrapped
    override val unsolvedAssignment: AssignmentMultipleChoiceReadDTO,
    override val answer: AnswerCreateReadDTO.MultipleChoice
) : SolvedAssignmentReadDTO
