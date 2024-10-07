package ut.isep.management

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@OpenAPIDefinition
@SpringBootApplication
class ManagementApplication

fun main(args: Array<String>) {
    runApplication<ManagementApplication>(*args)
}
