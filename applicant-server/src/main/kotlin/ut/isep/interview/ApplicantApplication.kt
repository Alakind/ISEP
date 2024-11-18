package ut.isep.interview

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories

@OpenAPIDefinition
@SpringBootApplication
@EnableFeignClients
@EnableRedisRepositories(basePackages = ["ut.isep.interview.redis",])
class ApplicantApplication

fun main(args: Array<String>) {
	runApplication<ApplicantApplication>(*args)
}
