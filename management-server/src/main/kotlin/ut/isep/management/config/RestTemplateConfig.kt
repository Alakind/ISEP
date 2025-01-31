package ut.isep.management.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.web.client.RestTemplate

@Configuration
class RestTemplateConfig {

    @Bean(name = ["githubRestTemplate"])
    fun githubRestTemplate(): RestTemplate {
        val githubToken = System.getenv("GITHUB_TOKEN")
            ?: throw IllegalArgumentException("Please provide a GitHub token")
        val restTemplate = RestTemplate()
        val interceptor = ClientHttpRequestInterceptor { request, body, execution ->
            request.headers.add("Authorization", "Bearer $githubToken")
            execution.execute(request, body)
        }
        restTemplate.interceptors = listOf(interceptor)
        return restTemplate
    }

    @Bean(name = ["executorRestTemplate"])
    fun executorRestTemplate(): RestTemplate {
        val restTemplate = RestTemplate()
        // Additional configuration for executor-related requests if needed
        return restTemplate
    }
}
