package ut.isep.management

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.jdbc.datasource.DriverManagerDataSource
import javax.sql.DataSource

@TestConfiguration
class PostgreSQLTestConfig {

    @Bean
    @Primary
    fun interviewsDataSources(): DataSource {
        val container = PostgresTestContainer.instance
        return DriverManagerDataSource().apply {
            setDriverClassName("org.postgresql.Driver")
            url = container.jdbcUrl
            username = container.username
            password = container.password
        }
    }
}