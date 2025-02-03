package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import ut.isep.interview.code_execution.utils.CodeExecutorUtils.createAndReturnTempFiles
import ut.isep.interview.code_execution.utils.ContainerAPI
import ut.isep.interview.code_execution.utils.TestResult
import java.io.File

object SQLExecutor : CodeExecutor {

    override fun startContainer(inviteId: String, container: File) {
        val id = ContainerAPI.startContainer(container, "$inviteId-sql")
        ContainerAPI.runCommandInContainerById(id, "mkdir /project")
        ContainerAPI.copyToContainerById(id, File("src/main/resources/projects/sql/cleanDatabase.sql").absoluteFile, "/project")
        ContainerAPI.runCommandInContainerById(id, "export MYSQL_ALLOW_EMPTY_PASSWORD=True && touch /log.txt && /usr/local/bin/docker-entrypoint.sh mysqld > /log.txt &")
    }

    override fun runTest(inviteId: String, test: TestRunDTO): List<TestResult> {
        //FIXME: NO, PLEASE GOD NOOOOO
        try {
            startContainer(inviteId, File("src/main/resources/defaultContainers/SQLDockerfile"))
        } catch (_: Exception) {
        }

        val name = "$inviteId-sql"
        val files = createAndReturnTempFiles(inviteId, test.code, test.test, test.codeFileName ?: "Code.sql", test.testFileName ?: "TestCode.py")
        ContainerAPI.runCommandInContainerByName(name, "mysql < /project/cleanDatabase.sql")
        ContainerAPI.copyToContainerByName(name, files.first, "/project")
        ContainerAPI.copyToContainerByName(name, files.second, "/project")
        ContainerAPI.runCommandInContainerByName(name, "mysql test < /project/${files.first.name}")
        val testOutput = ContainerAPI.runCommandInContainerByName(name, "python /project/${files.second.name}")
        return PythonExecutor.getTestResult(test.test ?: files.second.readText(), testOutput.error)
    }
}