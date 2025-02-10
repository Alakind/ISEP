package ut.isep.management.controller

import dto.PaginatedDTO
import dto.assessment.AssessmentReadDTO
import dto.invite.InviteCreateDTO
import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import dto.invite.PreInfoReadDTO
import enumerable.AllowedInvitesDateAttributeNames
import enumerable.InviteStatus
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
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
    @Operation(
        summary = "Get all invites",
        description = "Returns a list of all invites"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns a list of all invites",
            ),
            ApiResponse(
                responseCode = "400",
                description = "Returns when sorting attribute name or ASC/DESC are incorrectly spelled, " +
                        "or the date attributes are not in the correct order",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getInvites(
        @ParameterObject
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
    @Operation(
        summary = "Get invite",
        description = "Returns an invite or 404 if not found"
    )
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
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getInvite(@PathVariable id: UUID): ResponseEntity<InviteReadDTO> {
        return ResponseEntity.ok(inviteReadService.getById(id))
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
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun createInvite(@RequestBody inviteRequest: InviteCreateDTO): ResponseEntity<URI> {
        val createdInvite = inviteCreateService.create(inviteRequest)
        val inviteUrl = ServletUriComponentsBuilder
            .fromCurrentRequestUri() // Use the current request's URI
            .replacePath("/invite/${createdInvite.id}") // Replace the path with the desired path
            .build()
            .toUri()
        return ResponseEntity.created(inviteUrl).build()
    }

    @PutMapping
    @Operation(
        summary = "Update an invite",
        description = "Update an invite in the PostGreSQL Management database " +
                "\nExtra info: " +
                "\n- only app_reminded_once, app_reminded_twice, app_finished, cancelled can be set. Other status changes happen automatically by the system." +
                "\n- Finishing the invite will close the invites' access for the applicant and start auto scoring process and execute secret tests with the cleanup of execution containers." +
                "\n- Cancelling can be done if the invite isn't finished yet."
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
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun putInvite(@RequestBody inviteDTO: InviteUpdateDTO): ResponseEntity<String> {
        inviteUpdateService.checkStatusChange(inviteDTO)
        inviteUpdateService.update(inviteDTO)

        if (inviteDTO.status == InviteStatus.app_finished) {
            inviteUpdateService.startAutoScoring(inviteDTO.id)
            inviteUpdateService.requestContainerCleanup(inviteDTO.id)
        }

        return ResponseEntity.ok("Updated an invite")
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
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun deleteInvite(@PathVariable id: UUID): ResponseEntity<String> {
        inviteReadService.delete(id)
        return ResponseEntity.noContent().build()
    }


    @GetMapping("/{id}/assessment")
    @Tag(name = "Assessment")
    @Operation(
        summary = "Get the assessment by invite UUID",
        description = "Return assessment as list of section IDs and starts the assessment" +
                "\nExtra info:" +
                "\n- This request will start the assessment when all checks are passing or will close it when the available time has passed when it was started."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the assessment",
            ),
            ApiResponse(
                responseCode = "401",
                description = "Not authorized to retrieve assessment",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Assessment not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "Assessment is not started after start process initialization or the available time is not known",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getAssessment(@PathVariable id: UUID): ResponseEntity<AssessmentReadDTO> {
        // Check if the request can be proceeded
        inviteReadService.checkAccessibilityAssessment(id)
        val invite = inviteReadService.getById(id)
        if (invite.status == InviteStatus.not_started) {
            inviteReadService.startAssessment(id)
        }
        inviteReadService.checkTimingAssessment(id)
        val assessment: AssessmentReadDTO = inviteReadService.getAssessmentByInviteId(id)
        return ResponseEntity.ok(assessment)
    }

    @GetMapping("/{id}/info")
    @Operation(
        summary = "Get the info regarding the invite pre starting the assessment",
        description = "Return the available seconds and the name of the assessment"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the pre info",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Pre info not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getPreInfo(@PathVariable id: UUID): ResponseEntity<PreInfoReadDTO> {
        return ResponseEntity.ok(inviteReadService.getPreInfoByInviteId(id))
    }
}
