package ut.isep.management

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableAsync

@OpenAPIDefinition
@SpringBootApplication
@EnableAsync
@EnableJpaRepositories(basePackages = ["ut.isep.management.repository"])
class ManagementApplication {
}

fun main(args: Array<String>) {
    runApplication<ManagementApplication>(*args)

}
