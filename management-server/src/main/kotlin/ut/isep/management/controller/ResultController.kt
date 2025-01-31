package ut.isep.management.controller

import dto.assignment.ResultAssignmentUpdateDTO
import dto.scorecomparison.ScoreComparisonReadDTO
import dto.section.ResultSectionReadDTO
import dto.section.ResultSectionSimpleReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.solution.ResultReadService
import ut.isep.management.service.solution.ResultUpdateService
import java.util.*

@RestController
@Tag(name = "Result")
class ResultController(
    val resultReadService: ResultReadService,
    val resultUpdateService: ResultUpdateService,
) {
    @GetMapping("section/{sectionId}/result/{inviteId}")
    @Operation(
        summary = "Get results for the given section",
        description = "Get results for the given section from the PostGreSQL Management database",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found results for the given section",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Not found results for the given section or not found the invite for the given invite id",
            )
        ]
    )
    fun getResultsBySection(@PathVariable sectionId: Long, @PathVariable inviteId: UUID): ResponseEntity<ResultSectionReadDTO> {
        return ResponseEntity.ok(resultReadService.getResultSection(inviteId, sectionId))
    }

    @PutMapping("assignment/{assignmentId}/result/{inviteId}")
    @Operation(
        summary = "Update the score of the assignment for the result",
        description = "Update an assignment of the result in the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the assignment of the result",
            ),
            ApiResponse(
                responseCode = "403",
                description = "System tried to update assignments not belonging to the found invite",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assignment of the result couldn't be found",
            )
        ]
    )
    fun putResultsPerAssignment(@RequestBody resultAssignmentDTO: ResultAssignmentUpdateDTO, @PathVariable assignmentId: String, @PathVariable inviteId: UUID): ResponseEntity<String> {
        resultUpdateService.updateAssignment(inviteId, resultAssignmentDTO)
        return ResponseEntity.ok("Updated an assignment")
    }

    @GetMapping("assessment/{assessmentId}/result/{inviteId}")
    @Operation(
        summary = "Get results for the given assessment",
        description = "Get results for the given assessment from the PostGreSQL Management database",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found results for the given assessment",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assessment for the given assessment id not found or invite not found for the given invite id",
            )
        ]
    )
    fun getResultByAssessment(@PathVariable assessmentId: Long, @PathVariable inviteId: UUID): ResponseEntity<List<ResultSectionSimpleReadDTO>> {
        return ResponseEntity.ok(resultReadService.getResultByAssessment(inviteId, assessmentId))
    }

    @GetMapping("result/{inviteId}/comparison")
    @Operation(
        summary = "Get the test score comparison regarding each other scored invite",
        description = "Get the test score comparison regarding each other scored invite from the PostGreSQL Management database",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Computed score comparison",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found for given invite id",
            )
        ]
    )
    fun getScoreComparison(@PathVariable inviteId: UUID): ResponseEntity<ScoreComparisonReadDTO> {
        return ResponseEntity.ok(resultReadService.computeScoreComparison(inviteId))
    }
}
