package ut.isep.management.controller

import dto.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.InviteService
import java.net.URI
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/invite")
@Tag(name = "Invite")
class InviteController(val inviteService: InviteService) {


    @GetMapping
    @Operation(summary = "Get all invites", description = "Returns a list of all invites")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all invites",
    )
    fun getInvites(): List<InviteReadDTO> {
        return inviteService.allInvites
    }

    @GetMapping("{id}")
    @Operation(summary = "Get invite", description = "Returns an invite or 404 if not found")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found",
                content = [Content(
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getInvite(@PathVariable id: Long): ResponseEntity<InviteReadDTO> {
        return try {
            ResponseEntity.ok(inviteService.getInviteReadDtoById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
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
    fun createInvite(
        @RequestBody inviteRequest: InviteCreateDTO
    ): ResponseEntity<URI> {
        return try {
            val inviteUrl = inviteService.createInvite(inviteRequest)
            ResponseEntity.created(inviteUrl).build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


    @DeleteMapping("{id}")
    @Operation(
        summary = "Delete an invite",
        description = "Delete an invite from the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "204",
                description = "Deleted the invite",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found",
            )
        ]
    )
    fun deleteInvite(@PathVariable id: Long): ResponseEntity<String> {
        return try {
            inviteService.deleteInvite(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


    @GetMapping("/{id}/assessment")
    @Tag(name = "Assessment")
    @Operation(
        summary = "Get the assessment by invite UUID",
        description = "Return assessment as list of section IDs"
    )
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
    fun getAssessment(@PathVariable id: Long): ResponseEntity<AssessmentReadDTO?> {
        return try {
            val assessment: AssessmentReadDTO = inviteService.getAssessmentByInviteId(id)
            ResponseEntity.ok(assessment)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
