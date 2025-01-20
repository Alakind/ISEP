package ut.isep.interview.code_execution.utils

import kotlinx.serialization.json.*
import java.io.File
import java.util.*
import java.util.concurrent.TimeUnit
import java.time.Instant

object ContainerAPI {
    val PREFIX = "applicant_server"

    /**
     * Starts a container with the provided containerfile.
     *
     * @param container The containerfile to be started.
     * @return the id of the container.
     */
    fun startContainer(container: File, tag: String = ""): String {
        val parsedTag = PREFIX + "-" + tag.replace(" ", "_").lowercase(Locale.getDefault())
        val imageId = buildImage(container, parsedTag)
        return runImage(imageId, parsedTag)
    }

    /**
     * Stops the container with the provided id.
     *
     * @param id The id of the container which should be stopped.
     * @return true if the container was found, false otherwise
     */
    fun stopContainer(id: String): Boolean {
        val killCommand = "docker kill $id"
        val resultKill = Command.CommandBuilder(killCommand).execute()
        if (resultKill.returnCode == 1) return false

        if (resultKill.returnCode != 0) throw RuntimeException("Killing the container with id '$id' failed")
        val removeCommand = "docker remove $id"
        val resultRemove = Command.CommandBuilder(removeCommand).execute()
        if (resultRemove.returnCode != 0) throw RuntimeException("Removing the container with id '$id' failed")
        return true
    }

    /**
     * Stops the container with the provided name.
     *
     * @param name The id of the container which should be stopped.
     * @return true if the container was found, false otherwise
     */
    fun stopContainerByName(name: String): Boolean {
        return stopContainer("$PREFIX-$name")
    }

    /**
     * Stops the containers started by this class which are older than the specified time.
     *
     * @param time All containers before this time are killed
     * @return Returns the amount of containers stopped
     */
    fun stopContainerOlderThan(time: Instant): Int {
        var amount: Int = 0
        val info: JsonArray = getDetailedContainerInfo()
        for (container in info) {
            val name: String = container.jsonObject["Name"]?.jsonPrimitive?.content ?: continue
            if (!name.startsWith("/$PREFIX")) {
                continue
            }
            val state: JsonObject = container.jsonObject["State"]!!.jsonObject

            val startTime: String = state["StartedAt"]!!.jsonPrimitive.content
            if (Instant.parse(startTime).isBefore(time)) {
                stopContainer(container.jsonObject["Id"]!!.jsonPrimitive.content)
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
    fun runCommandInContainerById(
        containerId: String,
        containerCommand: String,
        timeoutAmount: Long = 60,
        timeoutUnit: TimeUnit = TimeUnit.SECONDS,
    ): Command {
        val command = "docker exec $containerId /bin/bash -c \"$containerCommand\""
        return Command.CommandBuilder(command, timeoutAmount, timeoutUnit).execute()
    }

    /**
     * Runs a command within the container
     *
     * @param name The name of the running container.
     * @param containerCommand The command to run.
     * @return the string output
     */
    fun runCommandInContainerByName(
        name: String,
        containerCommand: String,
        timeoutAmount: Long = 60,
        timeoutUnit: TimeUnit = TimeUnit.SECONDS,
    ): Command {
        val command = "docker exec $PREFIX-$name /bin/bash -c \"$containerCommand\""
        return Command.CommandBuilder(command, timeoutAmount, timeoutUnit).execute()
    }

    /**
     * Copies a file or folder to the container
     *
     * @param id The id of the running container.
     * @param src The location of the file or folder to copy
     * @param dst The location inside the container where the file or folder should be copied to.
     */
    fun copyToContainerById(id: String, src: File, dst: String) {
        val command = "docker cp ${src.absolutePath} ${id}:${dst}"
        val result = Command.CommandBuilder(command).execute()
        if (result.returnCode != 0) throw RuntimeException("Copying the file failed with the following error message:\n${result.error}")
    }

    /**
     * Copies a file or folder to the container
     *
     * @param name The id of the running container.
     * @param src The location of the file or folder to copy
     * @param dst The location inside the container where the file or folder should be copied to.
     */
    fun copyToContainerByName(name: String, src: File, dst: String) {
        val command = "docker cp ${src.absolutePath} $PREFIX-${name}:${dst}"
        val result = Command.CommandBuilder(command).execute()
        if (result.returnCode != 0) throw RuntimeException("Copying the file failed with the following error message:\n${result.error}")
    }

    /**
     * Returns a list of all container names started by this API
     */
    fun getAllContainerNames(): List<String> {
        val command = "docker container ls --format=\"{{.Names}}\""
        val namesList = Command.CommandBuilder(command).execute().output
        return namesList.split("\n").filter { it.startsWith(PREFIX) }
    }

    private fun buildImage(container: File, tag: String? = null): String {
        val options: MutableList<String> = mutableListOf("-f=${container.absolutePath}")
        options.add("-t=$PREFIX-$tag")
        val buildCommand = "docker build ${options.joinToString(" ")} ."
        val build = Command.CommandBuilder(buildCommand).execute()
        if (build.returnCode != 0) throw RuntimeException("Could not build the containerImage:\n${build.error}")
        return build.error.lines().filter { it.contains("writing image ") }.first().split("writing image ").last().split(" ").first()
    }

    private fun runImage(imageId: String, tag: String): String {
        val command = "docker run -dt --name=$tag $imageId /bin/bash"
        val run = Command.CommandBuilder(command).execute()
        if (run.returnCode != 0) throw RuntimeException("Could not start the container:\n${run.error}")
        return run.output.replace("\n", "")
    }

    private fun getDetailedContainerInfo(): JsonArray {
        val command = "docker container ls --format=\"{{.Names}}\" | xargs -n1 docker container inspect"
        val result = Command.CommandBuilder(command).execute()
        if (result.returnCode == 123) return Json.parseToJsonElement("").jsonArray
        if (result.returnCode != 0) throw RuntimeException("Could not inspect the docker containers.")
        return Json.parseToJsonElement(result.output).jsonArray
    }
}