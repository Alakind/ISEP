package ut.isep.management.controller

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
import ut.isep.management.model.redis.State
import ut.isep.management.service.StateService

@RestController
@RequestMapping("/state")
class StateController(val stateService: StateService) {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all state objects",
    )
    fun getStates(): List<State> {
       return stateService.allState
    }

    @GetMapping("{id}")
    @Operation(summary = "Get state", description = "Returns either ApplicantDTO or 404 if not found")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the state",
        ),
        ApiResponse(
            responseCode = "404",
            description = "state not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getState(@PathVariable id: Long): ResponseEntity<State> {
        return try {
            ResponseEntity.ok(stateService.getStateById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("/add")
    @Operation(summary = "Add some state", description = "Transient testing method")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Added the state",
        )
    ])
    fun postState(): ResponseEntity<String> {
        stateService.addState(
            State(id = 0, status = 1)
        )
        return ResponseEntity.ok("Added some state")

    }
}
