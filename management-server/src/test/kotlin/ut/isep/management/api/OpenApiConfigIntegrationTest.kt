package ut.isep.management.api

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.PropertySource
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.client.RestTemplate
import ut.isep.management.ManagementApplicationIT

//@ExtendWith(SpringExtension::class)
@ActiveProfiles("integration-test")
@PropertySource("classpath:application-integration-test.properties")
class OpenApiConfigIntegrationTest(
    @Qualifier("executorTestRestTemplate")
    private val restTemplate: RestTemplate,
) : ManagementApplicationIT() {
    //NOTE: make sure the localhost servers are running

    @Test
    fun testOpenApiDocumentation() {
        val response = restTemplate.getForEntity("/v3/api-docs", String::class.java)

        assert(response.statusCode.is2xxSuccessful)
        assert(response.body?.contains("openapi") == true)
        assert(response.body?.contains("Management API") == true)
    }

    @Test
    fun testAllEndpointTagsPresent() {
        val response = restTemplate.getForEntity("/v3/api-docs", String::class.java)

        assert(response.statusCode.is2xxSuccessful)
        assert(response.body?.contains("Applicant") == true)
        assert(response.body?.contains("Assessment") == true)
        assert(response.body?.contains("Assignment") == true)
        assert(response.body?.contains("Email") == true)
        assert(response.body?.contains("Invite") == true)
        assert(response.body?.contains("Result") == true)
        assert(response.body?.contains("Section") == true)
        assert(response.body?.contains("Solution") == true)
        assert(response.body?.contains("Test result") == true)
        assert(response.body?.contains("Timing") == true)
        assert(response.body?.contains("User") == true)
    }
}
