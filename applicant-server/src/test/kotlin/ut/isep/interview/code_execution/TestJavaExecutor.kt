package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.interview.code_execution.utils.CodeExecutorUtils
import java.io.File
import java.time.Duration
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TestJavaExecutor {

    val ID = "58aba3a9-400a-4f4c-b9c4-4ab40273a027"

    @AfterEach
    fun killContainers() {
        CodeExecutorUtils.stopContainers(ID)
    }

    @Test
    fun testJavaContainerGood() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaGood/Code.java")
        val test = File("src/test/resources/codeExecutor/javaGood/TestCode.java")

        JavaExecutor.startContainer(ID, container)
        val result = JavaExecutor.runTest(ID, TestRunDTO(code.readText(), null, test.readText(), null))

        assertEquals(1, result.count { it.passed })
        assertEquals(1, result.size)
    }

    @Test
    fun testJavaContainerBad() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaBad/Code.java")
        val test = File("src/test/resources/codeExecutor/javaBad/TestCode.java")

        JavaExecutor.startContainer(ID, container)
        val result = JavaExecutor.runTest(ID, TestRunDTO(code.readText(), null, test.readText(), null))

        assertEquals(1, result.count { !it.passed })
        assertEquals(1, result.count { it.passed })
        assertEquals("expected: <5> but was: <4>", result.filter { !it.passed }.first().result)
    }

    @Test
    fun testJavaCompilationFailed() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val test = File("src/test/resources/codeExecutor/javaBad/TestCode.java")

        JavaExecutor.startContainer(ID, container)
        assertThrows<RuntimeException> {
            JavaExecutor.runTest(
                ID,
                TestRunDTO("Wait, I can't compile this", null, test.readText(), null)
            )
        }
    }

    @Test
    fun testJavaTestWithin2seconds() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaBad/Code.java")
        val test = File("src/test/resources/codeExecutor/javaBad/TestCode.java")

        JavaExecutor.startContainer(ID, container)

        //First run takes a little longer because of maven setup
        JavaExecutor.runTest(ID, TestRunDTO(code.readText(), null, test.readText(), null))

        val start = Instant.now()
        JavaExecutor.runTest(ID, TestRunDTO(code.readText(), null, test.readText(), null))
        val end = Instant.now()

        assertTrue(
            Duration.between(start, end) < Duration.ofSeconds(2),
            "Computed difference: ${Duration.between(start, end).toMillis()} milliseconds"
        ) //Windows will take 8/9 seconds with Docker WSL subsystem running
    }
}