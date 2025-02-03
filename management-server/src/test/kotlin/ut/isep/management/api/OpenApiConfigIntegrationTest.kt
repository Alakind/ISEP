package ut.isep.management.api

import disableSslVerification
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class OpenApiConfigIntegrationTest {

    @Autowired
    lateinit var restTemplate: TestRestTemplate

    @BeforeEach
    fun setUp() {
        disableSslVerification()
    }

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
