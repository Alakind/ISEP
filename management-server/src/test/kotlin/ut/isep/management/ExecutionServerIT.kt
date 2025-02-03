package ut.isep.management

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.PropertySource
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.client.RestTemplate
import java.util.*

@ActiveProfiles("integration-test")
@PropertySource("classpath:application-integration-test.properties")
class ExecutionServerIT(
    @Qualifier("executorRestTemplate")
    private val restTemplate: RestTemplate
) : ManagementApplicationIT() {

    @Value("\${execution.base-url}")
    lateinit var executionURL: String

    @Test
    fun `app one should communicate with app two`() {
        val appTwoUrl = "$executionURL/code-executor/${UUID.nameUUIDFromBytes(byteArrayOf(0))}/cleanup"

        // Sending a POST request without a body
        val response: ResponseEntity<String> = restTemplate.postForEntity(appTwoUrl, null, String::class.java)

        // Assert status code is 200 OK
        assertThat(response.statusCode.value()).isEqualTo(200)
    }

}