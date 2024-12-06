package ut.isep.management.controller

import dto.SectionReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.SectionService
import java.util.NoSuchElementException

@RestController
@RequestMapping("/section")
class SectionController(val sectionService: SectionService) {


    @GetMapping("/id")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all section IDs",
    )
    fun getSectionIDs(): ResponseEntity<List<Long>> {
       return ResponseEntity.ok(sectionService.allSectionIDs)
    }

    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all (full) sections",
    )
    fun getSections(): ResponseEntity<List<SectionReadDTO>> {
        return ResponseEntity.ok(sectionService.allSections)
    }


    @GetMapping("{id}")
    @Operation(summary = "Get section by ID", description = "Returns either Section DTO or 404 if not found")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the section",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Section not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getSection(@PathVariable id: Long): ResponseEntity<SectionReadDTO> {
        return try {
            return ResponseEntity.ok(sectionService.getSectionById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

}
