package ut.isep.management

import dto.testresult.TestResultCreateReadDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.PropertySource
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.client.RestTemplate
import org.springframework.web.reactive.function.client.WebClient
import java.util.*

@ActiveProfiles("integration-test")
@PropertySource("classpath:application-integration-test.properties")
class ExecutionServerIT(
    @Qualifier("executorRestTemplate")
    private val restTemplate: RestTemplate,
    @Qualifier("executorWebClient")
    private val webClient: WebClient
) : ManagementApplicationIT() {

    @Value("\${execution.base-url}")
    lateinit var executionURL: String

    @Test
    fun `management-server should communicate with applicant-server using RestTemplate`() {
        val executorURL = "$executionURL/code-executor/${UUID.nameUUIDFromBytes(byteArrayOf(0))}/cleanup"

        // Sending a POST request without a body
        val response: ResponseEntity<String> = restTemplate.postForEntity(executorURL, null, String::class.java)

        // Assert status code is 200 OK
        assertThat(response.statusCode.value()).isEqualTo(200)
    }

    @Test
    fun `management-server should communicate with applicant-server using WebClient`() {
        val executorURL = "/${UUID.nameUUIDFromBytes(byteArrayOf(0))}/cleanup"

        // Sending a POST request without a body and retrieving the response
        val response = webClient.post()
            .uri(executorURL)
            .retrieve()
            .toBodilessEntity()
            .block() ?: throw IllegalStateException("Response is null")

        // Assert status code is 200 OK
        assertThat(response.statusCode.value()).isEqualTo(200)
    }
}