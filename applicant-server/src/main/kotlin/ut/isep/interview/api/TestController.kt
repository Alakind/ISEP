package ut.isep.interview.api

import dto.InterviewDTO
import dto.SectionDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.interview.clients.ManagementApplicationClient

@RestController
@RequestMapping("/test")
class TestController {

    @Autowired
    var client: ManagementApplicationClient? = null

    @GetMapping("/section/{sectionId}")
    @Operation(summary = "Get a section", description = "Returns a section with all the assignments")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the section",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Section not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getSection(@PathVariable sectionId: Int): ResponseEntity<SectionDTO>? {
        val response: SectionDTO? = client?.getSection(sectionId)
        return if (response != null) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.notFound().build()
        }
    }

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
    fun getTest(@PathVariable applicantId: Int): ResponseEntity<InterviewDTO>? {
        val response: InterviewDTO? = client?.getTest(applicantId)
        return if (response != null) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.notFound().build()
        }
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
        client?.postSubmit(applicantId)
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
        client?.postSaveSection(applicantId, sectionId)
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
    fun getSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int): ResponseEntity<SectionDTO>? {
        val response: SectionDTO? = client?.getSaveSection(applicantId, sectionId)
        return if (response != null) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}