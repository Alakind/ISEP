package ut.isep.management.controller

import dto.PaginatedDTO
import dto.assessment.AssessmentReadDTO
import dto.invite.InviteCreateDTO
import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import enumerable.AllowedInvitesDateAttributeNames
import enumerable.InviteStatus
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
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ut.isep.management.exception.EndDateBeforeStartDateException
import ut.isep.management.service.invite.InviteCreateService
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.invite.InviteUpdateService
import java.net.URI
import java.time.LocalDate
import java.util.*

@RestController
@RequestMapping("/invite")
@Tag(name = "Invite")
class InviteController(
    val inviteReadService: InviteReadService,
    val inviteCreateService: InviteCreateService,
    val inviteUpdateService: InviteUpdateService,
) {


    @GetMapping
    @Operation(summary = "Get all invites", description = "Returns a list of all invites")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all invites",
    )
    fun getInvites(
        @PageableDefault(
            size = Int.MAX_VALUE,
            sort = ["expiresAt"],
            direction = Sort.Direction.DESC,
        ) pageable: Pageable,
        @RequestParam(required = false, name = "status") status: InviteStatus?,
        @RequestParam(required = false, name = "betweenDateAttribute") betweenDateAttribute: AllowedInvitesDateAttributeNames?,
        @RequestParam(required = false) startDate: LocalDate?,
        @RequestParam(required = false) endDate: LocalDate?
    ): PaginatedDTO<InviteReadDTO> {
        if (startDate != null && endDate != null && startDate > endDate) {
            throw EndDateBeforeStartDateException("The given end date attribute ($endDate) lies before the given ($startDate)")
        }

        var betweenDateAttributeEnum = betweenDateAttribute
        if (betweenDateAttributeEnum == null && (startDate != null || endDate != null)) {
            betweenDateAttributeEnum = AllowedInvitesDateAttributeNames.expiresAt
        }

        return if (status != null) {
            inviteReadService.getPaginatedAttributesWithDateRange(pageable, startDate, endDate, betweenDateAttributeEnum.toString(), listOf("status"), listOf(status))
        } else {
            inviteReadService.getPaginatedAttributesWithDateRange(pageable, startDate, endDate, betweenDateAttributeEnum.toString())
        }
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
    fun getInvite(@PathVariable id: UUID): ResponseEntity<InviteReadDTO> {
        return try {
            ResponseEntity.ok(inviteReadService.getById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(
        summary = "Invite an applicant",
        description = "Link applicant to an assessment, and generate an invite URL"
    )
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
            val createdInvite = inviteCreateService.create(inviteRequest)
            val inviteUrl = ServletUriComponentsBuilder
                .fromCurrentRequestUri() // Use the current request's URI
                .replacePath("/invite/${createdInvite.id}") // Replace the path with the desired path
                .build()
                .toUri()
            ResponseEntity.created(inviteUrl).build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PutMapping
    @Operation(
        summary = "Update an invite",
        description = "Update an invite in the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the invite",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found",
            )
        ]
    )
    fun putInvite(@RequestBody inviteDTO: InviteUpdateDTO): ResponseEntity<String> {
        return try {
            //TODO do checks for status change
            inviteUpdateService.update(inviteDTO)
            ResponseEntity.ok("Updated an invite")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


    @DeleteMapping("{id}")
    @Operation(
        summary = "Delete an invite",
        description = "Delete an invite from the PostGreSQL Management database"
    )
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
    fun deleteInvite(@PathVariable id: UUID): ResponseEntity<String> {
        return try {
            inviteReadService.delete(id)
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
            ),
            ApiResponse(
                responseCode = "401",
                description = "Not authorized to retrieve assessment",
                content = [Content(
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getAssessment(@PathVariable id: UUID): ResponseEntity<AssessmentReadDTO> {
        return try {
            // Check if the request can be proceeded
            inviteReadService.checkAccessibilityAssessment(id)

            val assessment: AssessmentReadDTO = inviteReadService.getAssessmentByInviteId(id)
            ResponseEntity.ok(assessment)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
