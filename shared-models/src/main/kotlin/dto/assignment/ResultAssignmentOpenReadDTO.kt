package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An open assignment complete with user solution and reference answer")
data class ResultAssignmentOpenReadDTO(
    @field: JsonUnwrapped
    val baseAssignment: AssignmentOpenReadDTO,
    override val userAnswer: AnswerCreateReadDTO.Open,
    override val referenceAnswer: AnswerCreateReadDTO.Open
) : ResultAssignmentReadDTO
