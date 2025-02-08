package ut.isep.management


import org.springframework.stereotype.Component
import org.testcontainers.containers.PostgreSQLContainer

@Component
object PostgresTestContainer {

    val instance: PostgreSQLContainer<*> by lazy {
        PostgreSQLContainer("postgres:17.2").apply {
            withDatabaseName("testdb")
            withUsername("testuser")
            withPassword("testpass")
            start()
        }
    }
}
