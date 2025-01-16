package ut.isep.interview.code_execution

import java.io.File
import java.lang.Thread.sleep

object CodeExecutor {
    fun stopContainers(inviteId: String) {
        val allContainers = ContainerAPI.getAllContainerNames()
        allContainers.filter { it.contains(inviteId) }.forEach(ContainerAPI::stopContainer)
    }

    fun startJavaContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-java")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
        ContainerAPI.copyToContainerById(id, File("src/main/resources/projects/java"), "/project")
    }

    fun runJavaTest(inviteId: String, code: File, tests: File): TestResult {
        val name = "$inviteId-java"
        ContainerAPI.copyToContainerByName(name, code, "/project/java/src/main/java/infoSupport")
        ContainerAPI.copyToContainerByName(name, tests, "/project/java/src/test/java/infoSupport")
        sleep(5000)
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "cd /project/java ; mvn -B test")
        return parseJavaTestOutput(testOutput.output);
    }

    private fun parseJavaTestOutput(output: String): TestResult {
        val tests = output.split(
            "[INFO] -------------------------------------------------------\n" +
                    "[INFO]  T E S T S\n" +
                    "[INFO] -------------------------------------------------------\n"
        )
        if (tests.size == 1) {
            throw RuntimeException("Something failed before the tests could be executed!")
        }
        val result = tests[1].split("[ERROR] Failures:")
        if (result.size == 1) {
            return TestResult(output, mapOf())
        }
        val failed: MutableMap<String, String> = mutableMapOf()
        for (line in result[1].split("\n")) {
            val test = line.split("[ERROR]   ")
            if (test.size == 1) {
                continue
            }
            failed.put(test[1].split(" ")[0], test[1].split(Regex(" "), 2)[1])
        }
        return TestResult(output, failed.toMap())
    }
}