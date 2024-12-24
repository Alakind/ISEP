package ut.isep.management.controller

import dto.PaginatedDTO
import dto.assessment.AssessmentReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ut.isep.management.service.assessment.AssessmentReadService


@RestController
@RequestMapping("/assessment")
@Tag(name = "Assessment")
class AssessmentController(val assessmentReadService: AssessmentReadService) {


    @GetMapping
    @Operation(summary = "Get all assessments", description = "Returns a list of all assessments")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all assessments",
    )
    fun getAssessments(
        @PageableDefault(
            size = Int.MAX_VALUE, sort = ["name"],
            direction = Sort.Direction.ASC
        ) pageable: Pageable,
    ): PaginatedDTO<AssessmentReadDTO> {
        return assessmentReadService.getPaginated(pageable = pageable)
    }


    @GetMapping("{id}")
    @Operation(summary = "Get assessment", description = "Returns an assessment or 404 if not found")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the assessment",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assessment not found",
                content = [Content(
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getAssessment(@PathVariable id: Long): ResponseEntity<AssessmentReadDTO> {
        return try {
            ResponseEntity.ok(assessmentReadService.getById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
