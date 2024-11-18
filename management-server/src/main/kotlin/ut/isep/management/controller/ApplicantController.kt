package ut.isep.management.controller

import dto.ApplicantCreateReadDTO
import dto.ApplicantUpdateDTO
import dto.InterviewDTO
import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ut.isep.management.service.ApplicantService
import java.net.URI
import java.util.*
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/applicant")
class ApplicantController(val applicantService: ApplicantService) {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all applicants",
    )
    fun getApplicants(): List<ApplicantCreateReadDTO> {
        return applicantService.allApplicants
    }

    
    @GetMapping("{id}")
    @Operation(summary = "Get applicant", description = "Returns either ApplicantDTO or 404 if not found")
    @ApiResponses(
        value = [
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
        ]
    )
    fun getApplicant(@PathVariable id: UUID): ResponseEntity<ApplicantCreateReadDTO> {
        return try {
            ResponseEntity.ok(applicantService.getApplicantById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(summary = "Adds an applicant", description = "Add an applicant to the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Added the applicant",
            )
        ]
    )
    fun postApplicant(@RequestBody applicant: ApplicantCreateReadDTO): ResponseEntity<String> {
        val createdApplicant = applicantService.createApplicant(applicant)
        val location: URI = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdApplicant.id)
            .toUri()

        return ResponseEntity.created(location).body("Added an applicant")
//        return ResponseEntity.ok("Added an applicant")
    }


    @PutMapping
    @Operation(summary = "Updates an applicant", description = "Update an applicant in the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            )
        ]
    )
    fun putApplicant(@RequestBody applicantDTO: ApplicantUpdateDTO): ResponseEntity<String> {
        return try {
            applicantService.updateApplicant(applicantDTO)
            ResponseEntity.ok("Updated an applicant")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @DeleteMapping
    @Operation(summary = "Updates an applicant", description = "Update an applicant in the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            )
        ]
    )
    fun deleteApplicant(@PathVariable id: UUID): ResponseEntity<String> {
        return try {
            applicantService.deleteApplicant(id)
            ResponseEntity.ok("Deleted an applicant")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("/add")
    @Operation(summary = "Adds a stub applicant", description = "Transient testing method")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Added the applicant",
            )
        ]
    )
    fun postStubApplicant(): ResponseEntity<String> {
        applicantService.createApplicant(
            ApplicantCreateReadDTO(
                status = ApplicantStatus.app_finished,
                preferredLanguage = null
            )
        )
        return ResponseEntity.ok("Added an applicant")
    }

    @GetMapping("/{applicantId}/interview")
    @Operation(
        summary = "Get the interview for the applicant",
        description = "Returns a list with all the sectionsID's"
    )
    @ApiResponses(
        value = [
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
        ]
    )
    fun getInterview(@PathVariable applicantId: Int): ResponseEntity<InterviewDTO> {
        //TODO implement
        return ResponseEntity.ok(InterviewDTO(69, listOf()))
    }

    @PostMapping("/{applicantId}/submit")
    @Operation(summary = "Submits the interview", description = "All saved answers will now be submitted")
    @ApiResponses(
        value = [
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
        ]
    )
    fun postInterviewSubmit(@PathVariable applicantId: Int, @RequestBody interview: InterviewDTO) {
        //TODO implement
    }
}
