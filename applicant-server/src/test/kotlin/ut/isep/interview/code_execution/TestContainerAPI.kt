package ut.isep.interview.code_execution

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import ut.isep.interview.code_execution.utils.Command
import ut.isep.interview.code_execution.utils.ContainerAPI
import java.io.File
import java.lang.Thread.sleep
import java.time.Instant

class TestContainerAPI {

    val ContainerFile: File = File("src/test/resources/Dockerfile").absoluteFile

    @Test
    fun testStartContainer() {
        // execute
        val id = ContainerAPI.startContainer(ContainerFile, "testtest")

        // test
        val result = Command.CommandBuilder("docker ps").execute()
        assertTrue(result.output.contains("testtest"))

        // cleanup
        Command.CommandBuilder("docker kill $id").execute()
        Command.CommandBuilder("docker remove $id").execute()
    }

    @Test
    fun testStopContainer() {
        // prepare
        val id = ContainerAPI.startContainer(ContainerFile, "testtest")
        val prepare = Command.CommandBuilder("docker ps").execute()
        assertTrue(prepare.output.contains("testtest"))

        // execute
        ContainerAPI.stopContainer(id)

        // test
        val result = Command.CommandBuilder("docker ps").execute()
        assertFalse(result.output.contains("testtest"))
    }

    @Test
    fun testStopContainerOlderThan() {
        // prepare
        val id = ContainerAPI.startContainer(ContainerFile, "testtest")
        val prepare = Command.CommandBuilder("docker ps").execute()
        assertTrue(prepare.output.contains("testtest"))
        val time = Instant.now()
        sleep(2000)

        // execute
        ContainerAPI.stopContainerOlderThan(time)

        // test
        val result = Command.CommandBuilder("docker ps").execute()
        assertFalse(result.output.contains("testtest"))
    }

    @Test
    fun testRunCommandInContainer() {
        // prepare
        val id = ContainerAPI.startContainer(ContainerFile, "testtest")
        val prepare = Command.CommandBuilder("docker ps").execute()
        assertTrue(prepare.output.contains("testtest"))

        // execute
        val result = ContainerAPI.runCommandInContainerById(id, "echo HelloWorld")

        // test
        assertTrue(result.output.contains("HelloWorld"))

        // cleanup
        Command.CommandBuilder("docker kill $id").execute()
        Command.CommandBuilder("docker remove $id").execute()
    }

    @Test
    fun testCopyToContainer() {
        // prepare
        val id = ContainerAPI.startContainer(ContainerFile, "testtest")
        val prepare = Command.CommandBuilder("docker ps").execute()
        assertTrue(prepare.output.contains("testtest"))

        // execute
        ContainerAPI.copyToContainerById(id, File("src/test/resources/test.txt"), "/tmp")

        // test
        val result = ContainerAPI.runCommandInContainerById(id, "cat /tmp/test.txt")
        assertTrue(result.output.contains("HelloWorld"))

        // cleanup
        Command.CommandBuilder("docker kill $id").execute()
        Command.CommandBuilder("docker remove $id").execute()
    }
}