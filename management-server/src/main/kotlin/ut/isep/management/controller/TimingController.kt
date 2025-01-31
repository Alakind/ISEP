package ut.isep.management.controller

import dto.timing.TimingPerSectionInSecondsUpdateDTO
import dto.timing.TimingPerSectionReadDTO
import dto.timing.TimingPerSectionSwitchUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.timing.TimingPerSectionReadService
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import java.util.*

@RestController
@Tag(name = "Timing")
class TimingController(
    val timingPerSectionReadService: TimingPerSectionReadService,
    val timingPerSectionUpdateService: TimingPerSectionUpdateService
) {

    @PutMapping("/timing/{inviteId}")
    @Operation(
        summary = "Update timing",
        description = "Method for putting timing for sections in seconds",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the timing for the specified section",
            ),
            ApiResponse(
                responseCode = "403",
                description = "Forbidden to update measuredTimeSection that don't belong to your invite",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Found no existing measured time for section ID",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun updateTimingOfSectionInSeconds(@PathVariable inviteId: UUID, @RequestBody timingInSecondsUpdateDTO: TimingPerSectionInSecondsUpdateDTO): ResponseEntity<String> {
        timingPerSectionUpdateService.updateTiming(inviteId, timingInSecondsUpdateDTO)
        return ResponseEntity.ok("Updated measuredTime")
    }

    @PutMapping("/timing/{inviteId}/switch")
    @Operation(
        summary = "Switch section for timing",
        description = "Method for putting timing for sections based on switching to new section",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Switch to new section and updated time of previous section and started new section timing",
            ),
            ApiResponse(
                responseCode = "403",
                description = "Forbidden to update measuredTimeSection that don't belong to your invite",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Found no existing measured time for section ID",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "409",
                description = "To many active section for time registration"
            ),
            ApiResponse(
                responseCode = "500",
                description = "No section with a timestamp found"
            )
        ]
    )
    fun updateTimingOfSectionSwitchSection(@PathVariable inviteId: UUID, @RequestBody timingSwitchUpdateDTO: TimingPerSectionSwitchUpdateDTO): ResponseEntity<String> {
        timingPerSectionUpdateService.updateTiming(inviteId, timingSwitchUpdateDTO)
        return ResponseEntity.ok("Updated measuredTime")
    }

    @GetMapping("section/{sectionId}/timing/{inviteId}")
    @Operation(
        summary = "Get timing for section ID",
        description = "Method for getting timing for a section in seconds",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the measured timing for the section",
            ),
            ApiResponse(
                responseCode = "404",
                description = "No measured timing for the section found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
        ]
    )
    fun getMeasuredTimeSectionBySection(@PathVariable sectionId: Long, @PathVariable inviteId: UUID): ResponseEntity<TimingPerSectionReadDTO> {
        return ResponseEntity.ok(timingPerSectionReadService.getByMeasuredTimeSectionId(inviteId, sectionId))
    }

    @GetMapping("/timing/{inviteId}")
    @Operation(
        summary = "Get total timing for section",
        description = "Method for getting the total measured time for an invite",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the total measured timing for the section",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found of timed section",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
        ]
    )
    fun getMeasuredTimeInvite(@PathVariable inviteId: UUID): ResponseEntity<TimingPerSectionReadDTO> {
        return ResponseEntity.ok(timingPerSectionReadService.getMeasuredTimeInvite(inviteId))
    }

    @GetMapping("/timing/{inviteId}/left")
    @Operation(
        summary = "Get time left for invite",
        description = "Method getting the left time in seconds for an invite",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the time left in seconds for the invite",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Invite not found of timed section",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "No assessment found for the invite, assessment closed, or invalid available time",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
        ]
    )
    fun getTimeLeftInvite(@PathVariable inviteId: UUID): ResponseEntity<TimingPerSectionReadDTO> {
        return ResponseEntity.ok(timingPerSectionReadService.getTimeLeft(inviteId))

    }
}