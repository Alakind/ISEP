package ut.isep.interview.code_execution

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.interview.code_execution.utils.CodeExecutorUtils
import java.io.File
import kotlin.test.assertEquals


class TestPythonExecutor {

    val ID = "58aba3a9-400a-4f4c-b9c4-4ab40273a027"

    @AfterEach
    fun killContainers() {
        CodeExecutorUtils.stopContainers(ID)
    }

    @Test
    fun testPythonContainerGood() {
        val container = File("src/test/resources/codeExecutor/PythonDockerfile")
        val code = File("src/test/resources/codeExecutor/pythonGood/Code.py")
        val test = File("src/test/resources/codeExecutor/pythonGood/TestCode.py")

        PythonExecutor.startContainer(ID, container)
        val result = PythonExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code.readText(), null, test.readText(), null)
        )

        assertEquals(1, result.count { it.passed })
        assertEquals(1, result.size)
    }

    @Test
    fun testPythonContainerBad() {
        val container = File("src/test/resources/codeExecutor/PythonDockerfile")
        val code = File("src/test/resources/codeExecutor/pythonBad/Code.py")
        val test = File("src/test/resources/codeExecutor/pythonBad/TestCode.py")

        PythonExecutor.startContainer(ID, container)
        val result = PythonExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code.readText(), null, test.readText(), null)
        )
        assertEquals(1, result.count { !it.passed })
        assertEquals(1, result.count { it.passed })
    }

    @Test
    fun testPythonTrice() {
        val container = File("src/test/resources/codeExecutor/PythonDockerfile")
        val code1 = File("src/test/resources/codeExecutor/pythonGood/Code.py")
        val test1 = File("src/test/resources/codeExecutor/pythonGood/TestCode.py")
        val code2 = File("src/test/resources/codeExecutor/pythonBad/Code.py")
        val test2 = File("src/test/resources/codeExecutor/pythonBad/TestCode.py")

        PythonExecutor.startContainer(ID, container)
        val result1 = PythonExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code1.readText(), null, test1.readText(), null)
        )
        assertEquals(0, result1.count { !it.passed })
        assertEquals(1, result1.count { it.passed })

        val result2 = PythonExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code2.readText(), null, test2.readText(), null)
        )
        assertEquals(1, result2.count { !it.passed })
        assertEquals(1, result2.count { it.passed })

        val result3 = PythonExecutor.runTest(ID,
            ut.isep.interview.code_execution.dto.Test(code1.readText(), null, test1.readText(), null)
        )
        assertEquals(0, result3.count { !it.passed })
        assertEquals(1, result3.count { it.passed })
    }

    @Test
    fun testPythonNotCompilable() {
        val container = File("src/test/resources/codeExecutor/PythonDockerfile")
        val test = File("src/test/resources/codeExecutor/pythonGood/TestCode.py")

        PythonExecutor.startContainer(ID, container)
        assertThrows<RuntimeException> {
            PythonExecutor.runTest(ID,
                ut.isep.interview.code_execution.dto.Test("Wait, I can't compile this", null, test.readText(), null)
            )
        }
    }
}