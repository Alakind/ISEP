package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A coding assignment complete with user solution and reference answer")
data class ResultAssignmentCodingReadDTO(
    @field: JsonUnwrapped
    override val solvedAssignment: SolvedAssignmentCodingReadDTO,
    override val referenceAnswer: AnswerCreateReadDTO.Coding,
    override val scoredPoints: Int
) : ResultAssignmentReadDTO
