package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved open assignment")
data class SolvedAssignmentOpenReadDTO(
    @field: JsonUnwrapped
    override val unsolvedAssignment: ReferenceAssignmentOpenReadDTO,
    override val answer: AnswerCreateReadDTO.Open
) : SolvedAssignmentReadDTO
