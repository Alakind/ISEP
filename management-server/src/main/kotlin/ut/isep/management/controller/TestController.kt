package ut.isep.management.controller

import dto.InterviewDTO
import dto.SectionDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/test")
class TestController {

    @GetMapping("/{applicantId}/test")
    @Operation(summary = "Get the test for the applicant", description = "Returns a list with all the sectionsID's")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the Test",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getTest(@PathVariable applicantId: Int): ResponseEntity<InterviewDTO> {
        //TODO implement
        return ResponseEntity.ok(InterviewDTO(69, listOf()))
    }

    @PostMapping("/{applicantId}/submit")
    @Operation(summary = "Submits the Test", description = "All cached answers will now be submitted")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Submitted successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun postTestSubmit(@PathVariable applicantId: Int) {
        //TODO implement
    }

    @PostMapping("/{applicantId}/save/{sectionId}")
    @Operation(summary = "Caches the section", description = "The provided section will be cached")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Cached the section successfully",
        ),
        ApiResponse(
            responseCode = "400",
            description = "The provided section does not belong to the section id",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant or Section not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun postSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: SectionDTO) {
        //TODO implement
    }

    @GetMapping("/{applicantId}/save/{sectionId}")
    @Operation(summary = "Get the cached section", description = "Retrieves the cached section")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Retrieved the section successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant or Section not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getTestCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int): ResponseEntity<SectionDTO> {
        //TODO implement
        return ResponseEntity.ok(SectionDTO(0, "Example Title", listOf()))
    }
}