package ut.isep.management.controller

import dto.SolutionUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/solution")
class SolutionController {

    /**
     * Hello.
     * This mapping has no useful logic; it's just a documentation example.
     *
     */
    @PutMapping("/{uuid}")
    @Operation(
        description = "Test method for putting solutions",
        operationId = "solution",
        tags = ["solution"]
    )
    @ApiResponse(
        responseCode = "200",
        content = [Content(
            schema = Schema(
                implementation = String::class
            )
        )]
    )
    fun doNothingWithSolution(@PathVariable uuid: UUID, @RequestBody solutionUpdateDTO: SolutionUpdateDTO): String {
        return "Solution Update DTO parsed with success"
    }
}
