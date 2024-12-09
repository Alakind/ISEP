package ut.isep.management.controller

import dto.solution.SolutionsUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.solution.SolutionUpdateService
import java.util.UUID

@RestController
@RequestMapping("/solution")
@Tag(name = "Solution")
class SolutionController(val solutionUpdateService: SolutionUpdateService) {

    /**
     * Hello.
     * This mapping has no useful logic; it's just a documentation example.
     *
     */
    @PutMapping("/{uuid}")
    @Operation(
        description = "Test method for putting solutions",
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
    fun updateSolutions(@PathVariable uuid: UUID, @RequestBody solutionsUpdateDTO: SolutionsUpdateDTO): ResponseEntity<String> {
        return try {
            solutionUpdateService.updateSolutions(uuid, solutionsUpdateDTO)
            ResponseEntity.ok("Updated ${solutionsUpdateDTO.size} solutions")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        } catch (e: UnsupportedOperationException) {
            ResponseEntity.status(403).build()
        }
    }
}
