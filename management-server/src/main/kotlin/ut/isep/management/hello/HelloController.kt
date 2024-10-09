package ut.isep.management.hello

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloController {

    @GetMapping("/hello")
    fun helloKotlin(): String = "Hello from the Management Server, built on Spring Boot with Kotlin"
}