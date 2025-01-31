package ut.isep.interview

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@OpenAPIDefinition
@SpringBootApplication
@EnableScheduling
class ApplicantApplication

fun main(args: Array<String>) {
	runApplication<ApplicantApplication>(*args)
}
