package ut.isep.interview.code_execution

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.File
import java.lang.Thread.sleep
import kotlin.test.assertEquals

class TestSQLExecutor {

    val ID = "58aba3a9-400a-4f4c-b9c4-4ab40273a027"

    @BeforeEach
    fun setUp() {
        val container = File("src/test/resources/codeExecutor/SQLDockerfile")
        SQLExecutor.startContainer(ID, container)
        sleep(3000)
    }

    @AfterEach
    fun killContainers() {
        CodeExecutor.stopContainers(ID)
    }

    @Test
    fun testSQLContainerGood() {
        val code = File("src/test/resources/codeExecutor/sqlGood/Code.sql")
        val test = File("src/test/resources/codeExecutor/sqlGood/TestCode.py")

        val result = SQLExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code.readText(), null, test.readText(), null)
        )

        assertEquals(4, result.count { it.passed })
        assertEquals(4, result.size)
    }

    @Test
    fun testSQLContainerBad() {
        val code = File("src/test/resources/codeExecutor/sqlBad/Code.sql")
        val test = File("src/test/resources/codeExecutor/sqlBad/TestCode.py")

        val result = SQLExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code.readText(), null, test.readText(), null)
        )

        assertEquals(1, result.count { !it.passed })
        assertEquals(3, result.count { it.passed })
    }
}