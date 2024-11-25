package ut.isep.management.controller

import dto.ApplicantCreateReadDTO
import dto.ApplicantInviteDTO
import dto.ApplicantUpdateDTO
import dto.InterviewDTO
import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ut.isep.management.service.ApplicantService
import java.net.URI
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/applicant")
class ApplicantController(val applicantService: ApplicantService) {


    @GetMapping
    @Operation(summary = "Get all applicants", description = "Returns a list of all applicants")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all applicants",
    )
    fun getApplicants(): List<ApplicantCreateReadDTO> {
        return applicantService.allApplicants
    }

    
    @GetMapping("{id}")
    @Operation(summary = "Get applicant", description = "Returns an applicant or 404 if not found")
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
    fun getApplicant(@PathVariable id: Long): ResponseEntity<ApplicantCreateReadDTO> {
        return try {
            ResponseEntity.ok(applicantService.getApplicantById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(
        summary = "Add an applicant",
        description = "Add an applicant to the PostGreSQL Management database")
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
    @Operation(
        summary = "Update an applicant",
        description = "Update an applicant in the PostGreSQL Management database")
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

    @DeleteMapping("{id}")
    @Operation(
        summary = "Delete an applicant",
        description = "Delete an applicant from the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "204",
                description = "Deleted the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            )
        ]
    )
    fun deleteApplicant(@PathVariable id: Long): ResponseEntity<String> {
        return try {
            applicantService.deleteApplicant(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


    @PostMapping("/{id}/invite")
    @Tag(name = "Invite")
    @Operation(
        summary = "Invite an applicant",
        description = "Link applicant to an assessment, and generate an invite URL")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Invited the Applicant, return URL",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant or assessment not found",
            )
        ]
    )
    fun inviteApplicantToAssessment(
            @PathVariable id: Long,
            @RequestBody inviteRequest: ApplicantInviteDTO
        ): ResponseEntity<URI> {
            return try {
                val inviteUrl = applicantService.inviteApplicantToAssessment(id, inviteRequest.assessmentId)
                ResponseEntity.created(inviteUrl).build()
            } catch (e: NoSuchElementException) {
                ResponseEntity.status(404).build()
            }
    }

    @GetMapping("/{id}/invite")
    @Tag(name = "Invite")
    @Operation(
        summary = "Get the invite of an applicant",
        description = "Return the assessment ID if applicant has been invited")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns assessment ID if applicant has been invited",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            )
        ]
    )
    fun getApplicantInvite(@PathVariable id: Long): ResponseEntity<ApplicantInviteDTO> {
        return try {
            val invite: ApplicantInviteDTO? = applicantService.getInviteByApplicantId(id)
            ResponseEntity.ok(invite)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("/{applicantId}/assessment")
    @Tag(name = "Assessment")
    @Operation(
        summary = "Get the interview for the applicant",
        description = "Return a list of section IDs"
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
    fun getInterview(@PathVariable applicantId: Long): ResponseEntity<InterviewDTO?> {
        return try {
            val interview: InterviewDTO? = applicantService.getInterviewByApplicantId(applicantId)
            ResponseEntity.ok(interview)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
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
