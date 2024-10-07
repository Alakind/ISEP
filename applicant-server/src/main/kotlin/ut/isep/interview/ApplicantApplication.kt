package ut.isep.interview

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@OpenAPIDefinition
@SpringBootApplication
class ApplicantApplication

fun main(args: Array<String>) {
	runApplication<ApplicantApplication>(*args)
}
