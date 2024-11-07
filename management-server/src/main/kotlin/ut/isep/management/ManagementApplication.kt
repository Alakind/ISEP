package ut.isep.management

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.data.redis.RedisConnectionDetails
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories

@OpenAPIDefinition
@SpringBootApplication

@EnableRedisRepositories(basePackages = ["ut.isep.management.repository.redis",])
@EnableJpaRepositories(basePackages = ["ut.isep.management.repository.pgsql",])
class ManagementApplication {
}

fun main(args: Array<String>) {
    runApplication<ManagementApplication>(*args)

}
