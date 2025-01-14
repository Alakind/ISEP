package ut.isep.management.controller

import dto.timing.TimingPerSectionInSecondsUpdateDTO
import dto.timing.TimingPerSectionReadDTO
import dto.timing.TimingPerSectionSwitchUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
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
        description = "Method for putting timing for sections in seconds",
    )
    @ApiResponse(
        responseCode = "200",
        content = [Content(
            schema = Schema(
                implementation = String::class
            )
        )]
    )
    fun updateTimingOfSectionInSeconds(
        @PathVariable inviteId: UUID,
        @RequestBody timingInSecondsUpdateDTO: TimingPerSectionInSecondsUpdateDTO //with sectionId
    ): ResponseEntity<String> {
        return try {
            timingPerSectionUpdateService.updateTiming(inviteId, timingInSecondsUpdateDTO)
            ResponseEntity.ok("Updated measuredTime")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        } catch (e: UnsupportedOperationException) {
            ResponseEntity.status(403).build()
        }
    }

    @PutMapping("/timing/{inviteId}/switch")
    @Operation(
        description = "Method for putting timing for sections based on switching to new section",
    )
    @ApiResponse(
        responseCode = "200",
        content = [Content(
            schema = Schema(
                implementation = String::class
            )
        )]
    )
    fun updateTimingOfSectionSwitchSection(
        @PathVariable inviteId: UUID,
        @RequestBody timingSwitchUpdateDTO: TimingPerSectionSwitchUpdateDTO //with sectionId
    ): ResponseEntity<String> {
        return try {
            timingPerSectionUpdateService.updateTiming(inviteId, timingSwitchUpdateDTO)
            ResponseEntity.ok("Updated measuredTime")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        } catch (e: UnsupportedOperationException) {
            ResponseEntity.status(403).build()
        }
    }

    @GetMapping("section/{sectionId}/timing/{inviteId}")
    fun getMeasuredTimeSectionBySection(
        @PathVariable sectionId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<TimingPerSectionReadDTO> {
        return try {
            ResponseEntity.ok(timingPerSectionReadService.getByMeasuredTimeSectionId(inviteId, sectionId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}