package ut.isep.interview.code_execution

import ut.isep.interview.code_execution.dto.Test
import ut.isep.interview.code_execution.utils.TestResult
import java.io.File

interface CodeExecutor {

    fun startContainer(inviteId: String, container: File)

    fun runTest(inviteId: String, test: Test): List<TestResult>
}