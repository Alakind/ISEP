package ut.isep.interview.code_execution

import ut.isep.interview.code_execution.CodeExecutor.createAndReturnTempFiles
import ut.isep.interview.code_execution.utils.ContainerAPI
import ut.isep.interview.code_execution.utils.TestResult
import java.io.File

object SQLExecutor {

    fun startContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-sql")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
        ContainerAPI.copyToContainerById(id, File("src/main/resources/projects/sql/cleanDatabase.sql").absoluteFile, "/project")
        ContainerAPI.runCommandInContainerById(id, "export MYSQL_ALLOW_EMPTY_PASSWORD=True && /usr/local/bin/docker-entrypoint.sh mysqld &")
    }

    fun runTest(inviteId: String, code: String, tests: String?): List<TestResult> {
        val name = "$inviteId-sql"
        val files = createAndReturnTempFiles(inviteId, code, tests, "Code.sql", "TestCode.py")
        ContainerAPI.runCommandInContainerByName(name, "mysql < /project/cleanDatabase.sql")
        ContainerAPI.copyToContainerByName(name, files.first, "/project")
        ContainerAPI.copyToContainerByName(name, files.second, "/project")
        ContainerAPI.runCommandInContainerByName(name, "mysql test < /project/${files.first.name}")
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "python /project/${files.second.name}")
        if (tests == null) {
            return PythonExecutor.getTestResult(files.second.readText(), testOutput.error)
        }
        return PythonExecutor.getTestResult(tests, testOutput.error);
    }
}