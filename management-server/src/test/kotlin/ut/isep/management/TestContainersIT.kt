package ut.isep.management

import org.junit.jupiter.api.BeforeEach
import org.springframework.test.context.ContextConfiguration

@ContextConfiguration(classes = [PostgreSQLTestConfig::class])
abstract class TestContainersIT {

    companion object {
        val username: String = PostgresTestContainer.instance.username
        val database: String = PostgresTestContainer.instance.databaseName

        @BeforeEach
        fun clearDB() {
            PostgresTestContainer.instance.execInContainer(
                "postgres",
                "-U",
                username,
                "-d",
                database,
                "-c",
                "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
            )
        }
    }
}