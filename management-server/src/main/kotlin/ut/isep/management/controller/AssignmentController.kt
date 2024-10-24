package ut.isep.management.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import models.Assignment
import models.AssignmentMultipleChoice
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/assignment")
class AssignmentController {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all assignments",
    )
    fun getAssignments(): List<Assignment> {
       return listOf(AssignmentMultipleChoice(
           0,
           listOf("What is your name?"),
           false,
           listOf("Everard", "Jesse", "Ruben", "Jarno", "Aleks")
       ))
    }

    @GetMapping("{id}")
    @Operation(summary = "Get assignment", description = "Returns either AssignmentMultipleChoice or AssignmentCoding, or 404 if not found")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the assignment",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Assignment not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getAssignment(@PathVariable id: Int): ResponseEntity<Assignment> {
        return if (id >= 0) {
            ResponseEntity.ok(AssignmentMultipleChoice(
                id,
                listOf("What is your name?"),
                false,
                listOf("Everard", "Jesse", "Ruben", "Jarno", "Aleks")
            ))
        } else {
            ResponseEntity.status(404).build()
        }
    }
}