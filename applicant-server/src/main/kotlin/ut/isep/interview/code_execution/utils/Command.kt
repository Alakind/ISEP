package ut.isep.interview.code_execution.utils

import java.io.File
import java.util.*
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

class Command(
    val command: String,
    val output: String,
    val error: String,
    val returnCode: Int
) {
    class CommandBuilder(
        private val command: String,
        private val timeoutAmount: Long = 90,
        private val timeoutUnit: TimeUnit = TimeUnit.SECONDS,
        private val workingDir: File = File(".").absoluteFile
    ) {

        fun execute(): Command {
            val os = System.getProperty("os.name").lowercase(Locale.getDefault())
            val processBuilder: ProcessBuilder = if (os.contains("win")) {
                ProcessBuilder("powershell", "-Command", command)
            } else {
                ProcessBuilder("/bin/bash", "-l", "-c", command)
            }

            processBuilder.directory(workingDir)
                .redirectOutput(ProcessBuilder.Redirect.PIPE)
                .redirectError(ProcessBuilder.Redirect.PIPE)

            val process: Process = processBuilder.start()

            val output = StringBuilder()
            val error = StringBuilder()

            val reader = process.inputStream.bufferedReader()
            val readerError = process.errorStream.bufferedReader()

            val thread = Thread {
                reader.useLines { lines -> lines.forEach { output.appendLine(it) } }
            }
            val threadError = Thread {
                readerError.useLines { lines -> lines.forEach { error.appendLine(it) } }
            }

            thread.start()
            threadError.start()

            if (process.waitFor(timeoutAmount, timeoutUnit)) {
                thread.join()
                threadError.join()
                return Command(
                    command,
                    output.toString(),
                    error.toString(),
                    process.waitFor()
                )
            } else {
                process.destroy()
                process.inputStream.close()
                process.errorStream.close()
                thread.join()
                threadError.join()
                throw TimeoutException("The command: \"${command}\" Timed out:\n${error}")
            }
        }
    }
}