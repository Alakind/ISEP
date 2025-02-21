package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import ut.isep.interview.code_execution.utils.CodeExecutorUtils.createAndReturnTempFiles
import ut.isep.interview.code_execution.utils.ContainerAPI
import dto.execution.TestResultDTO
import java.io.File

object JavaExecutor : CodeExecutor {

    override fun startContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-java")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
        ContainerAPI.copyToContainerById(id, File("src/main/resources/projects/java"), "/project")
    }

    override fun runTest(inviteId: String, test: TestRunDTO): List<TestResultDTO> {
        //FIXME: Management should initialize the containers when the client logs in
        try {
            startContainer(inviteId, File("src/main/resources/defaultContainers/JavaDockerfile"))
        } catch (_: Exception) {}

        val name = "$inviteId-java"
        val files = createAndReturnTempFiles(inviteId, test.code, test.test, test.codeFileName ?: "Code.java", test.testFileName ?: "TestCode.java")
        ContainerAPI.copyToContainerByName(name, files.first, "/project/java/src/main/java/infoSupport")
        ContainerAPI.copyToContainerByName(name, files.second, "/project/java/src/test/java/infoSupport")
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "cd /project/java ; mvn -B test")
        return getTestResult(test.test ?: files.second.readText(), testOutput.output)
    }

    private fun getTestResult(testsString: String, output: String): List<TestResultDTO> {
        val result = parseTestOutput(output).toMutableList()
        val failedTests = result.map { it.name }
        result.addAll(parseTests(testsString)
            .filter { it !in failedTests }
            .map { TestResultDTO(it, "", true) })

        return result
    }

    private fun parseTests(testString: String): List<String> {
        val testNames: MutableList<String> = mutableListOf()
        var test = false

        for (line in testString.lines()) {
            if (test) {
                testNames.add(line.split("()")[0].split(" ").last())
            }
            test = (line.trim().startsWith("@Test"))
        }
        return testNames
    }

    private fun parseTestOutput(output: String): List<TestResultDTO> {
        val tests = output.split(
            "[INFO] -------------------------------------------------------\n" +
                    "[INFO]  T E S T S\n" +
                    "[INFO] -------------------------------------------------------\n"
        )
        if (tests.size == 1) {
            throw RuntimeException("Something failed before the tests could be executed!\n\n$output")
        }
        val result = tests[1].split("[ERROR] Failures:")
        if (result.size == 1) {
            return listOf()
        }
        val failed: MutableList<TestResultDTO> = mutableListOf()
        for (line in result[1].split("\n")) {
            val test = line.split("[ERROR]   ")
            if (test.size == 1) {
                continue
            }
            failed.add(
                TestResultDTO(test[1].split(" ")[0].split("[.:]".toRegex())[1],
                test[1].split(Regex(" "), 2)[1],
                false)
            )
        }
        return failed
    }
}