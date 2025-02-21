package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import ut.isep.interview.code_execution.utils.CodeExecutorUtils
import java.io.File
import java.lang.Thread.sleep
import java.time.Duration
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TestSQLExecutor {

    val ID = "58aba3a9-400a-4f4c-b9c4-4ab40273a027"

    @BeforeEach
    fun setUp() {
        val container = File("src/test/resources/codeExecutor/SQLDockerfile")
        SQLExecutor.startContainer(ID, container)
        sleep(5000)
    }

    @AfterEach
    fun killContainers() {
        CodeExecutorUtils.stopContainers(ID)
    }

    @Test
    fun testSQLContainerGood() {
        val code = File("src/test/resources/codeExecutor/sqlGood/Code.sql")
        val test = File("src/test/resources/codeExecutor/sqlGood/TestCode.py")

        val result = SQLExecutor.runTest(
            ID,
            TestRunDTO(code.readText(), null, test.readText(), null)
        )

        assertEquals(4, result.count { it.passed })
        assertEquals(4, result.size)
    }

    @Test
    fun testSQLContainerBad() {
        val code = File("src/test/resources/codeExecutor/sqlBad/Code.sql")
        val test = File("src/test/resources/codeExecutor/sqlBad/TestCode.py")

        val result = SQLExecutor.runTest(
            ID,
            TestRunDTO(code.readText(), null, test.readText(), null)
        )

        assertEquals(1, result.count { !it.passed })
        assertEquals(3, result.count { it.passed })
    }

    @Test
    fun testSQLTestWithin2seconds() {
        val code = File("src/test/resources/codeExecutor/sqlBad/Code.sql")
        val test = File("src/test/resources/codeExecutor/sqlBad/TestCode.py")

        val start = Instant.now()
        SQLExecutor.runTest(
            ID,
            TestRunDTO(code.readText(), null, test.readText(), null)
        )
        val end = Instant.now()

        assertTrue(
            Duration.between(start, end) < Duration.ofSeconds(2),
            "Computed difference: ${Duration.between(start, end).toMillis()} milliseconds"
        ) //Windows will take 5/6 seconds with Docker WSL subsystem running
    }
}