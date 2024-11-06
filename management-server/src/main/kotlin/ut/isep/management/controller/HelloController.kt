package ut.isep.management.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloController {

    /**
     * Hello.
     * This mapping has no useful logic; it's just a documentation example.
     *
     */
    @GetMapping("/hello")
    @Operation(
        description = "Say hello",
        operationId = "hello",
        tags = ["test"]
    )
    @ApiResponse(
        responseCode = "200",
        content = [Content(
            schema = Schema(
                implementation = String::class
            )
        )]
    )
    fun helloKotlin(): String {
        return "Hello from the Management Server, built on Spring Boot with Kotlin"
    }
}
