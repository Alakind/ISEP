package ut.isep.management.controller

import dto.section.SolvedSectionReadDTO
import dto.solution.SolutionsUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
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
        summary = "Update solution",
        description = "Updating the solution in the PostGreSQL Management database" +
                "\nExtra info:" +
                "\n- As a fallback on the /invite/{inviteId}/assessment, this request also will start the assessment when all checks are passing or will close it when the available time has passed " +
                "when it was started.",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Solution",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "401",
                description = "Not authorized to retrieve assessment",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "403",
                description = "Forbidden to update solutions that don't belong to the invite"
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assessment not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
        ]
    )
    fun updateSolutions(@PathVariable uuid: UUID, @RequestBody solutionsUpdateDTO: SolutionsUpdateDTO): ResponseEntity<String> {
        // Check if the request can be proceeded
        inviteReadService.checkAccessibilityAssessment(uuid)

        solutionUpdateService.updateSolutions(uuid, solutionsUpdateDTO)
        return ResponseEntity.ok("Updated ${solutionsUpdateDTO.size} solutions")
    }

    @GetMapping("section/{sectionId}/solution/{inviteId}")
    @Operation(
        summary = "Get all solved assignment by section id",
        description = "Get all solved assignment by section id from the PostGreSQL Management database",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the solved assignment by section id",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Section not found",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Parent directory of file not found"
            )
        ]
    )
    fun getSolvedAssignmentsBySection(@PathVariable sectionId: Long, @PathVariable inviteId: UUID): ResponseEntity<SolvedSectionReadDTO> {
        return ResponseEntity.ok(solutionReadService.getSolvedSection(inviteId, sectionId))
    }
}
