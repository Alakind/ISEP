package ut.isep.interview.code_execution

import java.io.File
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

class Command (
    val command: String,
    val output: String,
    val error: String,
    val returnCode: Int
) {
    class CommandBuilder(
        private val command: String,
        private val timeoutAmount: Long = 60,
        private val timeoutUnit: TimeUnit = TimeUnit.SECONDS,
        private val workingDir: File = File(".").absoluteFile
    ) {

        fun execute(): Command {
            val process: Process = ProcessBuilder("/bin/bash", "-l", "-c", command)
                .directory(workingDir)
                .redirectOutput(ProcessBuilder.Redirect.PIPE)
                .redirectError(ProcessBuilder.Redirect.PIPE)
                .start()
            if (process.waitFor(timeoutAmount, timeoutUnit)) {
                return Command(command,
                        process.inputStream.bufferedReader().readText(),
                        process.errorStream.bufferedReader().readText(),
                        process.waitFor())
            } else {
                val output = process.inputStream.bufferedReader().readText()
                process.destroy()
                throw TimeoutException("The command: \"${command}\" Timed out:\n${output}")
            }
        }
    }
}