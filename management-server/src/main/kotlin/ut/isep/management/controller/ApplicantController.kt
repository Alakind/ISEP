package ut.isep.management.controller

import dto.PaginatedDTO
import dto.applicant.ApplicantCreateDTO
import dto.applicant.ApplicantReadDTO
import dto.applicant.ApplicantUpdateDTO
import dto.invite.InviteReadDTO
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
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.applicant.ApplicantCreateService
import ut.isep.management.service.applicant.ApplicantReadService
import ut.isep.management.service.applicant.ApplicantUpdateService
import java.net.URI

@RestController
@RequestMapping("/applicant")
@Tag(name = "Applicant")
class ApplicantController(
    val applicantReadService: ApplicantReadService,
    val applicantUpdateService: ApplicantUpdateService,
    val applicantCreateService: ApplicantCreateService
) {

    @GetMapping
    @Operation(
        summary = "Get all applicants",
        description = "Returns a list of all applicants for the given search term(s) and pagination variables",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns a list of all applicants",
            ),
            ApiResponse(
                responseCode = "400",
                description = "Returns when sorting attribute name or ASC/DESC are incorrectly spelled",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getApplicants(
        @ParameterObject
        @PageableDefault(
            size = Int.MAX_VALUE, sort = ["name"],
            direction = Sort.Direction.ASC
        ) pageable: Pageable,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) email: String?
    ): PaginatedDTO<ApplicantReadDTO> {
        val exampleApplicant = if (name != null || email != null) {
            Applicant(name = name, email = email)
        } else {
            null
        }
        return applicantReadService.getPaginatedEntity(exampleApplicant, pageable)
    }


    @GetMapping("{id}")
    @Operation(
        summary = "Get applicant",
        description = "Returns an applicant or 404 if not found"
    )
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
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getApplicant(@PathVariable id: Long): ResponseEntity<ApplicantReadDTO> {
        return ResponseEntity.ok(applicantReadService.getById(id))
    }

    @PostMapping
    @Operation(
        summary = "Add an applicant",
        description = "Add an applicant to the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Added the applicant",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Failed to add applicant",
            )
        ]
    )
    fun postApplicant(@RequestBody applicant: ApplicantCreateDTO): ResponseEntity<String> {
        val createdApplicant = applicantCreateService.create(applicant)
        val location: URI = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdApplicant.id)
            .toUri()

        return ResponseEntity.created(location).body("Added an applicant")
    }


    @PutMapping
    @Operation(
        summary = "Update an applicant",
        description = "Update an applicant in the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Failed to update an applicant",
            )
        ]
    )
    fun putApplicant(@RequestBody applicantDTO: ApplicantUpdateDTO): ResponseEntity<String> {
        applicantUpdateService.update(applicantDTO)
        return ResponseEntity.ok("Updated an applicant")
    }

    @DeleteMapping("{id}")
    @Operation(
        summary = "Delete an applicant",
        description = "Delete an applicant from the PostGreSQL Management database"
    )
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
        applicantReadService.delete(id)
        return ResponseEntity.noContent().build()
    }


    @GetMapping("/{id}/invite")
    @Tag(name = "Invite")
    @Operation(
        summary = "Get the invites of an applicant",
        description = "Returns invites belonging to applicant if applicant has been invited"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns invites belonging to applicant if applicant has been invited",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
            )
        ]
    )
    fun getApplicantInvites(@PathVariable id: Long): ResponseEntity<List<InviteReadDTO>> {
        val invites: List<InviteReadDTO> = applicantReadService.getInvitesByApplicantId(id)
        return ResponseEntity.ok(invites)
    }
}
