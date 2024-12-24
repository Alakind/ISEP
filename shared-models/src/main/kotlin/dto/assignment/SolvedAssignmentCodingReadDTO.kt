package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved coding assignment")
data class SolvedAssignmentCodingReadDTO(
    @field: JsonUnwrapped
    override val unsolvedAssignment: AssignmentCodingReadDTO,
    override val answer: AnswerCreateReadDTO.Coding,
) : SolvedAssignmentReadDTO
