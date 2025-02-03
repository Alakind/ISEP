package ut.isep.interview.code_execution

import dto.execution.TestRunDTO
import dto.execution.TestResultDTO
import java.io.File

interface CodeExecutor {

    fun startContainer(inviteId: String, container: File)

    fun runTest(inviteId: String, test: TestRunDTO): List<TestResultDTO>
}