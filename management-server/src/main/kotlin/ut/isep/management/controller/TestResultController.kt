package ut.isep.management.controller

import dto.testresult.TestResultCreateDTO
import dto.testresult.TestResultUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ut.isep.management.service.solution.TestResultCreateService
import ut.isep.management.service.solution.TestResultUpdateService
import java.net.URI

@RestController
@RequestMapping("/test-result")
@Tag(name = "Test result")
class TestResultController(
    val testResultCreateService: TestResultCreateService,
    val testResultUpdateService: TestResultUpdateService
) {

    @PostMapping
    @Operation(
        summary = "Add a test result",
        description = "Add a test result for a solved assignment to the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Added the test result",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Failed to add test result",
            )
        ]
    )
    fun postTestResult(@RequestBody testResult: TestResultCreateDTO): ResponseEntity<String> {
        val createdTestResult = testResultCreateService.create(testResult)
        val location: URI = ServletUriComponentsBuilder.fromCurrentRequest() // location can't be used to get test result
            .path("/{id}")
            .buildAndExpand(createdTestResult.id)
            .toUri()

        return ResponseEntity.created(location).body("Added a test result")
    }

    @PutMapping
    @Operation(
        summary = "Update a test result",
        description = "Update a test result in the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the test result",
            ),
            ApiResponse(
                responseCode = "403",
                description = "Forbidden to update the test result not belonging to the invite",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Test result not found",
            )
        ]
    )
    //TODO: find out if this endpoint is necessary
    fun putTestResult(@RequestBody testResultDTO: TestResultUpdateDTO): ResponseEntity<String> {
        testResultUpdateService.update(testResultDTO)
        return ResponseEntity.ok("Updated a test result")
    }
}