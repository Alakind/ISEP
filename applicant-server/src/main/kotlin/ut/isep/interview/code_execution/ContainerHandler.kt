package ut.isep.interview.code_execution

import java.io.File
import java.util.*
import java.util.concurrent.TimeUnit
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant

class ContainerHandler {
    val PREFIX = "applicant_server"

    /**
     * Starts a container with the provided containerfile.
     *
     * @param container The containerfile to be started.
     * @return the id of the container.
     */
    fun startContainer(container: File, tag: String = ""): String {
        val imageId = buildImage(container, tag.replace(" ", "_"))
        return runImage(imageId)
    }

    /**
     * Stops the container with the provided id.
     *
     * @param id The id of the container which should be stopped.
     * @return true if the container was found, false otherwise
     */
    fun stopContainer(id: String): Boolean {
        val command = "docker kill $id"
        val result = Command.CommandBuilder(command).execute()
        if (result.returnCode == 1) return false
        if (result.returnCode != 0) throw RuntimeException("Killing the container with id '$id' failed")
        return true
    }

    /**
     * Stops the containers started by this class which are older than the specified time.
     *
     * @param time All containers before this time are killed
     * @return Returns the amount of containers stopped
     */
    fun stopContainerOlderThan(time: Instant): Int {
        var amount: Int = 0
        val info: List<Map<String, Any>> = getDetailedContainerInfo()
        for (container in info) {
            val name: String = container["Name"] as String
            if (!name.startsWith("/$PREFIX")) {
                continue
            }
            val state: Map<String, Any> = container["State"] as Map<String, Any>
            val startTime: Instant = state["StartedAt"] as Instant
            if (startTime.isBefore(time)) {
                stopContainer(container["Id"] as String)
                amount += 1
            }
        }
        return amount
    }

    /**
     * Runs a command within the container
     *
     * @param containerId The id of the running container.
     * @param command The command to run.
     * @return the string output
     */
    fun runCommandInContainer(containerId: String,
                              containerCommand: String,
                              timeoutAmount: Long = 60,
                              timeoutUnit: TimeUnit = TimeUnit.SECONDS,
    ): Command {
        val command = "docker exec $containerId /bin/bash -c \"$containerCommand\""
        return Command.CommandBuilder(command, timeoutAmount, timeoutUnit).execute()
    }

    private fun buildImage(container: File, tag: String? = null): String {
        val options: MutableList<String> = mutableListOf("-f=${container.absolutePath}")
        options.add("-t=$PREFIX-$tag")
        val buildCommand = "docker build ${options.joinToString(" ")} ."
        val build = Command.CommandBuilder(buildCommand).execute()
        if (build.returnCode != 0) throw RuntimeException("Could not build the containerImage.")
        return build.output.lines().last().split("writing image ").last().split(" ").first()
    }

    private fun runImage(imageId: String): String {
        val command = "docker run -dt $imageId /bin/bash"
        val run = Command.CommandBuilder(command).execute()
        if (run.returnCode != 0) throw RuntimeException("Could not start the container.")
        return run.output
    }

    private fun getDetailedContainerInfo(): List<Map<String, Any>> {
        val command = "docker container ls --format=\"{{.Names}}\" | xargs -n1 docker container inspect"
        val result = Command.CommandBuilder(command).execute()
        if (result.returnCode == 123) return listOf()
        if (result.returnCode != 0) throw RuntimeException("Could not inspect the docker containers.")
        return jacksonObjectMapper().reader().readValue(result.output)
    }
}