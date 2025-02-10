package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import dto.testresult.TestResultCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A coding assignment complete with user solution and reference answer")
data class ResultAssignmentCodingReadDTO(
    @field: JsonUnwrapped
    override val solvedAssignment: SolvedAssignmentCodingReadDTO,
    override val referenceAnswer: AnswerCreateReadDTO.Coding,
    override val scoredPoints: Int?,
    val testResults: List<TestResultCreateReadDTO>,
    val secretTestResults: List<TestResultCreateReadDTO>,
    override val availablePoints: Int,
) : ResultAssignmentReadDTO
