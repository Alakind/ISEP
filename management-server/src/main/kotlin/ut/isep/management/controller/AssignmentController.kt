package ut.isep.management.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import dto.assignment.ReferenceAssignmentReadDTO
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.assignment.ReferenceAssignmentReadService
import java.util.NoSuchElementException

@RestController
@RequestMapping("/assignment")
@Tag(name = "Assignment")
class AssignmentController(val assignmentReadService: ReferenceAssignmentReadService) {

    @GetMapping("{id}")
    @Operation(summary = "Get assignment", description = "Returns either AssignmentMultipleChoice, AssignmentOpen, AssignmentCoding, or 404 if not found")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the assignment",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Assignment not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getAssignmentById(@PathVariable id: Long, @RequestParam commit: String): ResponseEntity<ReferenceAssignmentReadDTO> {
        return try {
            return ResponseEntity.ok(assignmentReadService.getById(id, commit))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
