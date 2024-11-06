package ut.isep.management.controller

import dto.ApplicantDTO
import dto.InterviewDTO
import dto.SectionDTO
import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.model.pgsql.Applicant
import ut.isep.management.service.ApplicantService

@RestController
@RequestMapping("/applicant")
class ApplicantController(val applicantService: ApplicantService) {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all applicants",
    )
    fun getApplicants(): List<ApplicantDTO> {
       return applicantService.allApplicants
    }

    @GetMapping("{id}")
    @Operation(summary = "Get applicant", description = "Returns either ApplicantDTO or 404 if not found")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the applicant",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getApplicant(@PathVariable id: Long): ResponseEntity<ApplicantDTO> {
        return try {
            ResponseEntity.ok(applicantService.getApplicantById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(summary = "Adds an applicant", description = "Add an applicant to the PostGreSQL Management database")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Added the applicant",
        )
    ])
    fun postApplicant(@RequestBody applicant: ApplicantDTO): ResponseEntity<String> {
        applicantService.addApplicant(applicant)
        return ResponseEntity.ok("Added an applicant")
    }

    @GetMapping("/add")
    @Operation(summary = "Adds a stub applicant", description = "Transient testing method")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Added the applicant",
        )
    ])
    fun postStubApplicant(): ResponseEntity<String> {
        applicantService.addApplicant(
            Applicant(
                status = ApplicantStatus.app_finished,
                interview = null,
                preferredLanguage = null)
        )
        return ResponseEntity.ok("Added an applicant")
    }

    @GetMapping("/{applicantId}/interview")
    @Operation(summary = "Get the interview for the applicant", description = "Returns a list with all the sectionsID's")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the interview",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getInterview(@PathVariable applicantId: Int): ResponseEntity<InterviewDTO> {
        //TODO implement
        return ResponseEntity.ok(InterviewDTO(69, listOf()))
    }

    @PostMapping("/{applicantId}/submit")
    @Operation(summary = "Submits the interview", description = "All saved answers will now be submitted")
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
        //TODO implement
    }

    @PostMapping("/{applicantId}/save-section/{sectionId}")
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

    @GetMapping("/{applicantId}/save-section/{sectionId}")
    @Operation(summary = "Get the cached section", description = "Retrieves the saved section")
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
    fun getInterviewCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int): ResponseEntity<SectionDTO> {
        //TODO implement
        return ResponseEntity.ok(SectionDTO(0, "Example Title", listOf()))
    }
}
