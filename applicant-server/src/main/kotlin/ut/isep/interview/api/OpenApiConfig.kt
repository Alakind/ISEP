package ut.isep.interview.api

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun interviewAPI(): OpenAPI {
        return OpenAPI()
            .components(Components())
            .info(
                Info()
                .title("Applicant API")
                .description("This is the Swagger documentation for the API facing the applicant front end."))
    }
}