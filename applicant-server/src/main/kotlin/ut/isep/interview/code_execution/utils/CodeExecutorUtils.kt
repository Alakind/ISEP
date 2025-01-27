package ut.isep.interview.code_execution.utils

import java.io.File
import java.nio.file.Files

object CodeExecutorUtils {
    fun stopContainers(inviteId: String) {
        val allContainers = ContainerAPI.getAllContainerNames()
        allContainers.filter { it.contains(inviteId) }.forEach(ContainerAPI::stopContainer)
    }

    fun createAndReturnTempFiles(inviteId: String,
                                         codeString: String, testsString: String?,
                                         codeFileName: String, testsFileName:String): Pair<File, File> {
        val dir = Files.createTempDirectory(inviteId)
        val codeFile = dir.resolve(codeFileName).toFile()
        codeFile.writeText(codeString)

        val testFile = dir.resolve(testsFileName).toFile()
        if (!testFile.exists() && testsString == null) {
            throw IllegalArgumentException("A file containing tests should be provided")
        }
        if (testsString != null) {
            testFile.writeText(testsString)
        }
        return Pair(codeFile, testFile)
    }
}