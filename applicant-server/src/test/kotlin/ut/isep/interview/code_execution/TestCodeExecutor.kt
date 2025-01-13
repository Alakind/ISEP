package ut.isep.interview.code_execution

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import java.io.File
import kotlin.test.assertEquals

class TestCodeExecutor {

    val ID = "58aba3a9-400a-4f4c-b9c4-4ab40273a027"

    @AfterEach
    fun killContainers(): Unit {
        CodeExecutor.stopContainers(ID)
    }

    @Test
    fun testJavaContainerGood() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaGood/Code.java")
        val test = File("src/test/resources/codeExecutor/javaGood/TestCode.java")

        CodeExecutor.startJavaContainer(ID, container)
        val result = CodeExecutor.runJavaTest(ID, code, test)

        assertEquals(0, result.failedTests.size)
    }

    @Test
    fun testJavaContainerBad() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaBad/Code.java")
        val test = File("src/test/resources/codeExecutor/javaBad/TestCode.java")

        CodeExecutor.startJavaContainer(ID, container)
        val result = CodeExecutor.runJavaTest(ID, code, test)

        assertEquals(1, result.failedTests.size)
        assertEquals("expected: <5> but was: <4>", result.failedTests.values.first())
    }
}