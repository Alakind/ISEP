package ut.isep.interview

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@OpenAPIDefinition
@SpringBootApplication
@EnableFeignClients
class ApplicantApplication

fun main(args: Array<String>) {
	runApplication<ApplicantApplication>(*args)
}
