package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import ut.isep.interview.code_execution.utils.CodeExecutorUtils.createAndReturnTempFiles
import ut.isep.interview.code_execution.utils.ContainerAPI
import dto.execution.TestResultDTO
import java.io.File

object PythonExecutor : CodeExecutor {

    override fun startContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-python")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
    }

    override fun runTest(inviteId: String, test: TestRunDTO): List<TestResultDTO> {
        //FIXME: Management server should initialize the container when the applicant logs in
        try {
            startContainer(inviteId, File("src/main/resources/defaultContainers/PythonDockerfile"))
        } catch (_: Exception) {
        }

        val name = "$inviteId-python"
        val files = createAndReturnTempFiles(inviteId, test.code, test.test, test.codeFileName ?: "Code.py", test.testFileName ?: "Test.py")
        ContainerAPI.copyToContainerByName(name, files.first, "/project")
        ContainerAPI.copyToContainerByName(name, files.second, "/project")
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "cd /project ; python Test.py")
        return getTestResult(test.test ?: files.second.readText(), testOutput.error)
    }

    fun getTestResult(testsString: String, output: String): List<TestResultDTO> {
        val result = parseTestOutput(output).toMutableList()
        val failedTests = result.map { it.name }
        result.addAll(
            parseTests(testsString)
                .filter { it !in failedTests }
                .map { TestResultDTO(it, "", true) })
        return result
    }

    private fun parseTests(testString: String): List<String> {
        val testNames: MutableList<String> = mutableListOf()
        var test = false
        var classMethod = false

        for (line in testString.lines()) {
            if (test and !classMethod and line.matches(" +def .+".toRegex())) {
                testNames.add(line.split("def ")[1].split("(").first())
            }
            classMethod = test and line.matches(" +@classmethod.*".toRegex())
            test = (test and !line.matches("[a-zA-Z].*".toRegex())) or line.matches("^class .+?\\(unittest\\.TestCase\\):.*$".toRegex())
        }
        return testNames
    }

    private fun parseTestOutput(output: String): List<TestResultDTO> {
        val result: MutableList<TestResultDTO> = mutableListOf()
        var tests = output.split("={10,}".toRegex())
        if (output.equals("") || (tests.size == 1 && !tests[0].contains("OK"))) {
            throw RuntimeException("Something failed before the tests could be executed:\n\n$output")
        }
        tests = tests.drop(1)
        if (tests.isNotEmpty() && tests.first().startsWith("\nERROR:")) {
            throw RuntimeException("Build failed:\n\n$output")
        }
        for (test in tests) {
            result.add(
                TestResultDTO(
                    "FAIL: (\\w+)".toRegex().find(test)!!.groupValues[1],
                    test.split("-{10,}".toRegex())[1],
                    false
                )
            )
        }
        return result
    }
}