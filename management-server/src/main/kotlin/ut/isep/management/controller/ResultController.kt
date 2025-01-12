package ut.isep.management.controller

import dto.assignment.ResultAssignmentUpdateDTO
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
    fun getResultsBySection(
        @PathVariable sectionId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<ResultSectionReadDTO> {
        return try {
            ResponseEntity.ok(resultReadService.getResultSection(inviteId, sectionId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
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
                responseCode = "404",
                description = "Assignment of the result couldn't be found",
            )
        ]
    )
    fun putResultsPerAssignment(@RequestBody resultAssignmentDTO: ResultAssignmentUpdateDTO, @PathVariable assignmentId: String, @PathVariable inviteId: UUID): ResponseEntity<String> {
        return try {
            resultUpdateService.updateAssignment(inviteId, resultAssignmentDTO)
            ResponseEntity.ok("Updated an assignment")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("assessment/{assessmentId}/result/{inviteId}")
    fun getResultByAssessment(
        @PathVariable assessmentId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<List<ResultSectionSimpleReadDTO>> {
        return try {
            ResponseEntity.ok(resultReadService.getResultByAssessment(inviteId, assessmentId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
