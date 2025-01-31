package ut.isep.management.config

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import javax.sql.DataSource


@Configuration
class PostgreSQLConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.interviews")
    fun interviewsDataSourceProperties(): DataSourceProperties {
        return DataSourceProperties()
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.interviews.hikari")
    fun interviewsDataSource(): DataSource {
        return interviewsDataSourceProperties()
            .initializeDataSourceBuilder()
            .build()
    }

}
