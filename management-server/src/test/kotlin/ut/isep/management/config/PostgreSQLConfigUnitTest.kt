package ut.isep.management.config

import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import org.springframework.test.context.ActiveProfiles
import javax.sql.DataSource

@SpringBootTest
@ActiveProfiles("test")
class PostgreSQLConfigUnitTest {

    @Autowired
    lateinit var applicationContext: ApplicationContext

    @Autowired
    private lateinit var interviewsDataSource: DataSource


    @Test
    fun testInterviewsDataSourceNotNull() {
        assertNotNull(interviewsDataSource, "Interviews DataSource should not be null")
    }

    @Test
    fun testInterviewsDataSourcePropertiesBeanCreation() {
        val interviewsDataSourceProperties: DataSourceProperties = applicationContext.getBean("interviewsDataSourceProperties", DataSourceProperties::class.java)

        assertNotNull(interviewsDataSourceProperties, "Interviews DataSource Properties should not be null")
    }

    @Test
    fun testInterviewsDataSourceBeanCreation() {
        val interviewsDataSource: DataSource = applicationContext.getBean(DataSource::class.java)

        assertNotNull(interviewsDataSource, "Interviews DataSource should not be null")
    }
}
