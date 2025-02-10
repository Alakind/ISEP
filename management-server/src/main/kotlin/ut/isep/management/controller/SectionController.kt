package ut.isep.management.controller

import dto.section.SectionReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ut.isep.management.service.section.SectionReadService

@RestController
@RequestMapping("/section")
@Tag(name = "Section")
class SectionController(val sectionReadService: SectionReadService) {


    @GetMapping("/id")
    @Operation(
        summary = "Get all available section ids",
        description = "Get all available section ids from the PostGreSQL Management database",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns a list of all section IDs",
            )
        ]
    )
    fun getSectionIDs(): ResponseEntity<List<Long>> {
        return ResponseEntity.ok(sectionReadService.getAllIds())
    }

    @GetMapping
    @Operation(
        summary = "Get all available sections",
        description = "Get all available sections from the PostGreSQL Management database with the last version of the assignment files from the question repo" +
                "\nWarning: using this endpoint can take a long time as it makes request for each assignment",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns a list of all (full) sections",
            ),
            ApiResponse(
                responseCode = "500",
                description = "An assignment can't be retrieved from the question repo",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getSections(): ResponseEntity<List<SectionReadDTO>> {
        return ResponseEntity.ok(sectionReadService.getAll())
    }


    @GetMapping("{id}")
    @Operation(
        summary = "Get section by ID",
        description = "Returns either Section DTO or 404 if not found"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the section",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Section not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getSection(@PathVariable id: Long): ResponseEntity<SectionReadDTO> {
        return ResponseEntity.ok(sectionReadService.getById(id))
    }
}
