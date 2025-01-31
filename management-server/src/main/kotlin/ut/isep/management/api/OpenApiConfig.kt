package ut.isep.management.api

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.servers.Server
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun managementAPI(): OpenAPI {
        return OpenAPI()
            .components(Components())
            .info(
                Info()
                    .title("Management API")
                    .version("v1.0.0")
                    .description("This is the Swagger documentation for the API facing the management front end.")
            )
            .servers(
                listOf(
                    Server()
                        .url("https://localhost:8081")
                        .description("Development management server")
                )
            )
    }
}