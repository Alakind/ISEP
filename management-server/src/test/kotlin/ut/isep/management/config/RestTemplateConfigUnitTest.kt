package ut.isep.management.config

import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.client.RestTemplate

@SpringBootTest
@ActiveProfiles("test")
class RestTemplateConfigUnitTest {

    @Autowired
    lateinit var applicationContext: ApplicationContext

    @Test
    fun gitHubRestTemplateBeanCreation() {
        val githubRestTemplate: RestTemplate = applicationContext.getBean("githubRestTemplate", RestTemplate::class.java)

        assertNotNull(githubRestTemplate, "Github Rest Template should not be null")
    }

    @Test
    fun executorRestTemplate() {
        val executorRestTemplate: RestTemplate = applicationContext.getBean("executorRestTemplate", RestTemplate::class.java)

        assertNotNull(executorRestTemplate, "Executor Rest Template should not be null")
    }
}