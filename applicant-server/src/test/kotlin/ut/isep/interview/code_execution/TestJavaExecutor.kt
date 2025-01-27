package ut.isep.interview.code_execution

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import ut.isep.interview.code_execution.utils.CodeExecutorUtils
import ut.isep.interview.code_execution.dto.Test as codeStrings
import java.io.File
import kotlin.test.assertEquals

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
        val result = JavaExecutor.runTest(ID, codeStrings(code.readText(), null, test.readText(), null))

        assertEquals(1, result.count { it.passed })
        assertEquals(1, result.size)
    }

    @Test
    fun testJavaContainerBad() {
        val container = File("src/test/resources/codeExecutor/JavaDockerfile")
        val code = File("src/test/resources/codeExecutor/javaBad/Code.java")
        val test = File("src/test/resources/codeExecutor/javaBad/TestCode.java")

        JavaExecutor.startContainer(ID, container)
        val result = JavaExecutor.runTest(ID, codeStrings(code.readText(), null, test.readText(), null))

        assertEquals(1, result.count { !it.passed })
        assertEquals(1, result.count { it.passed })
        assertEquals("expected: <5> but was: <4>", result.filter { !it.passed }.first().result)
    }
}