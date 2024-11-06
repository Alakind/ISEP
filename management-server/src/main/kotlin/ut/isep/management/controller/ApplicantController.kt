package ut.isep.management.controller

import dto.ApplicantDTO
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
}
