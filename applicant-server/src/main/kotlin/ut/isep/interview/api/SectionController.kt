package ut.isep.interview.api

import dto.section.SectionReadDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ut.isep.interview.clients.ManagementApplicationClient

@RestController
@RequestMapping("/section")
class SectionController(val client: ManagementApplicationClient) {

    @GetMapping("{sectionId}")
    @Operation(summary = "Get a section", description = "Returns a section with all the assignments")
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
    fun getSection(@PathVariable sectionId: Int): ResponseEntity<SectionReadDTO>? {
        return try {
            ResponseEntity.ok(client.getSection(sectionId))
        } catch (e: feign.FeignException) {
            ResponseEntity.status(e.status()).build()
        }
    }
}
