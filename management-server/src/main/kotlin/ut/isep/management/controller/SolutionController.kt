package ut.isep.management.controller

import dto.section.SolvedSectionReadDTO
import dto.solution.SolutionsUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.solution.SolutionReadService
import ut.isep.management.service.solution.SolutionUpdateService
import java.util.*

@RestController
@Tag(name = "Solution")
class SolutionController(
    val solutionReadService: SolutionReadService,
    val solutionUpdateService: SolutionUpdateService,
    val inviteReadService: InviteReadService,
) {


    @PutMapping("solution/{uuid}")
    @Operation(
        description = "Method for putting solutions",
        operationId = "solution",
    )
    @ApiResponse(
        responseCode = "200",
        content = [Content(
            schema = Schema(
                implementation = String::class
            )
        )]
    )
    fun updateSolutions(
        @PathVariable uuid: UUID,
        @RequestBody solutionsUpdateDTO: SolutionsUpdateDTO
    ): ResponseEntity<String> {
        return try {
            // Check if the request can be proceeded
            inviteReadService.checkAccessibilityAssessment(uuid)

            solutionUpdateService.updateSolutions(uuid, solutionsUpdateDTO)
            ResponseEntity.ok("Updated ${solutionsUpdateDTO.size} solutions")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        } catch (e: UnsupportedOperationException) {
            ResponseEntity.status(403).build()
        }
    }

    @GetMapping("section/{sectionId}/solution/{inviteId}")
    fun getSolvedAssignmentsBySection(
        @PathVariable sectionId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<SolvedSectionReadDTO> {
        return try {
            ResponseEntity.ok(solutionReadService.getSolvedSection(inviteId, sectionId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
