package ut.isep.management.controller

import dto.assignment.ReferenceAssignmentReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.assignment.ReferenceAssignmentReadService

@RestController
@RequestMapping("/assignment")
@Tag(name = "Assignment")
class AssignmentController(val assignmentReadService: ReferenceAssignmentReadService) {

    @GetMapping("{id}")
    @Operation(
        summary = "Get assignment",
        description = "Returns either AssignmentMultipleChoice, AssignmentOpen, AssignmentCoding, or 404 if not found"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the assignment",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assignment not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "File path with id can't be found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getAssignmentById(@PathVariable id: Long, @RequestParam commit: String): ResponseEntity<ReferenceAssignmentReadDTO> {
        return ResponseEntity.ok(assignmentReadService.getById(id, commit))
    }
}
