package ut.isep.management.api

import io.swagger.v3.oas.models.OpenAPI
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import org.springframework.test.context.ActiveProfiles
import kotlin.test.assertNotNull

@SpringBootTest
@ActiveProfiles("test")
class OpenApiConfigUnitTest {

    @Autowired
    lateinit var applicationContext: ApplicationContext

    @Test
    fun testOpenApiBeanCreation() {
        val openApi: OpenAPI = applicationContext.getBean(OpenAPI::class.java)
        assertNotNull(openApi)
        assert(openApi.info.title == "Management API")
        assert(openApi.info.version == "v1.0.0")
        assert(openApi.info.description == "This is the Swagger documentation for the API facing the management front end.")
        println(openApi.servers[0].url)
        println(openApi.servers[0].description)
        assertNotNull(openApi.servers)
        assertNotNull(openApi.servers[0])
        assert(openApi.servers.size == 1)
        assert(openApi.servers[0].url == "https://localhost:8081")
        assert(openApi.servers[0].description == "Development management server")
    }
}