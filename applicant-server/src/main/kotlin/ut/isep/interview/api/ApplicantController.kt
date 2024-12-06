package ut.isep.interview.api

import dto.AssessmentReadDTO
import dto.SectionReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.interview.clients.ManagementApplicationClient

@RestController
@RequestMapping("/applicant")
class ApplicantController(val client: ManagementApplicationClient) {

    @GetMapping("/{applicantId}/interview")
    @Operation(summary = "Get the Interview for the applicant", description = "Returns a list with all the sectionsID's")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the Interview",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getInterview(@PathVariable applicantId: Int): ResponseEntity<AssessmentReadDTO>? {
        return try {
            ResponseEntity.ok(client.getInterview(applicantId))
        } catch (e: feign.FeignException) {
            ResponseEntity.status(e.status()).build()
        }
    }

    @PostMapping("/{applicantId}/submit")
    @Operation(summary = "Submits the Interview", description = "All saved answers will now be submitted")
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
    fun postInterviewSubmit(@PathVariable applicantId: Int) {
        client.postSubmit(applicantId)
    }

    @PostMapping("/{applicantId}/save-section/{sectionId}")
    @Operation(summary = "Caches the section", description = "The provided section will be saved")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Saved the section successfully",
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
    fun postSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: SectionReadDTO) {
        client.postSaveSection(applicantId, sectionId)
    }

    @GetMapping("/{applicantId}/save-section/{sectionId}")
    @Operation(summary = "Get the saved section", description = "Retrieves the saved section")
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
    fun getSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int): ResponseEntity<SectionReadDTO>? {
        return try {
            ResponseEntity.ok(client.getSaveSection(applicantId, sectionId))
        } catch (e: feign.FeignException) {
            ResponseEntity.status(e.status()).build()
        }
    }
}
