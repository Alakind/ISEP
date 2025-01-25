package ut.isep.interview.code_execution

import ut.isep.interview.code_execution.CodeExecutor.createAndReturnTempFiles
import ut.isep.interview.code_execution.utils.ContainerAPI
import ut.isep.interview.code_execution.utils.TestResult
import java.io.File

object PythonExecutor {

    fun startContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-python")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
    }

    fun runTest(inviteId: String, code: String, tests: String?): List<TestResult> {
        val name = "$inviteId-python"
        val files = createAndReturnTempFiles(inviteId, code, tests, "Code.py", "Test.py")
        ContainerAPI.copyToContainerByName(name, files.first, "/project")
        ContainerAPI.copyToContainerByName(name, files.second, "/project")
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "cd /project ; python Test.py")
        if (tests == null) {
            return getTestResult(files.second.readText(), testOutput.output)
        }
        return getTestResult(tests, testOutput.error);
    }

    private fun getTestResult(testsString: String, output: String): List<TestResult> {
        val result = parseTestOutput(output).toMutableList()
        val failedTests = result.map { it.name }
        result.addAll(
            parseTests(testsString)
            .filter { it !in failedTests }
            .map { TestResult(it, "", true) })
        return result
    }

    private fun parseTests(testString: String): List<String> {
        val testNames: MutableList<String> = mutableListOf()
        var test = false

        for (line in testString.lines()) {
            if (test and line.matches(" +def .+".toRegex())) {
                testNames.add(line.split("def ")[1].split("(").first())
            }
            test = (test and !line.matches("[a-zA-Z].*".toRegex())) or line.matches("^class .+?\\(unittest\\.TestCase\\):.*$".toRegex())
        }
        return testNames
    }

    private fun parseTestOutput(output: String): List<TestResult> {
        val result: MutableList<TestResult> = mutableListOf()
        val tests = output.split("={10,}".toRegex()).drop(1)
        for (test in tests) {
            result.add(TestResult("FAIL: (\\w+)".toRegex().find(test)!!.groupValues[1],
                test.split("-{10,}".toRegex())[1],
                false))
        }
        return result
    }
}