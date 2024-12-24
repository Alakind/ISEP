package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An open assignment complete with user solution and reference answer")
data class ResultAssignmentOpenReadDTO(
    @field: JsonUnwrapped
    override val solvedAssignment: SolvedAssignmentOpenReadDTO,
    override val referenceAnswer: AnswerCreateReadDTO.Open,
    override val scoredPoints: Int?
) : ResultAssignmentReadDTO
