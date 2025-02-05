package ut.isep.management

import com.ninjasquad.springmockk.clear
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.springframework.test.context.ContextConfiguration

@ContextConfiguration(classes = [PostgreSQLTestConfig::class])
abstract class TestContainersIT {

    companion object {
        val username: String = PostgresTestContainer.instance.username
        val database: String = PostgresTestContainer.instance.databaseName

        @JvmStatic
        @BeforeAll
        fun clearDB(): Unit {
            val result = PostgresTestContainer.instance.execInContainer(
                "psql",
                "-U", username,
                "-d", database,
                "-c", """
            DO $$ 
            DECLARE 
                table_name text;
            BEGIN
                FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
                LOOP
                    EXECUTE 'TRUNCATE TABLE ' || table_name || ' CASCADE';
                END LOOP;
            END $$;
        """
            )
            if (result.exitCode != 0) {
                throw IllegalStateException("Failed to clear database: ${result.stderr}")
            }
        }

        @AfterEach
        fun clearDBAfterEach() {
            clearDB()
        }
    }
}