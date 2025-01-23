package ut.isep.interview.api

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ut.isep.interview.code_execution.CodeExecutor
import ut.isep.interview.code_execution.JavaExecutor
import ut.isep.interview.code_execution.PythonExecutor
import ut.isep.interview.code_execution.SQLExecutor
import java.io.File

@RestController
@RequestMapping("/code-executor")
class CodeExecution {
    // Python, C#, SQL, Java, and JavaScript

    @PostMapping(path = ["/{uuid}/java/initialize"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializeJavaContainer(@PathVariable uuid: String, @RequestPart("file", required = false) file: MultipartFile?): ResponseEntity<Any> {
        val containerFile: File
        if (file == null) {
            containerFile = File("src/main/resources/defaultContainers/JavaDockerfile")
        } else {
            containerFile = File.createTempFile(file.name, null)
            file.transferTo(containerFile)
        }

        try {
            JavaExecutor.startContainer(uuid, containerFile)
            return ResponseEntity.ok().build()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(e.message)
        }
    }

    @PostMapping("/{uuid}/java/test")
    fun testJavaCode(@PathVariable uuid: String, @RequestBody() codeStrings: Map<String, String>): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }
        try {
            val result = JavaExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
            return ResponseEntity.ok().body(result)
        } catch (e: Exception) {
            return ResponseEntity.status(400).body(e.message)
        }
    }

    @PostMapping(path = ["/{uuid}/python/initialize"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializePythonContainer(@PathVariable uuid: String, @RequestPart("file", required = false) file: MultipartFile?): ResponseEntity<Any> {
        val containerFile: File
        if (file == null) {
            containerFile = File("src/main/resources/defaultContainers/PythonDockerfile")
        } else {
            containerFile = File.createTempFile(file.name, null)
            file.transferTo(containerFile)
        }

        try {
            PythonExecutor.startContainer(uuid, containerFile)
            return ResponseEntity.ok().build()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(e.message)
        }
    }

    @PostMapping("/{uuid}/python/test")
    fun testPythonCode(@PathVariable uuid: String, @RequestBody() codeStrings: Map<String, String>): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }
        try {
            val result = PythonExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
            return ResponseEntity.ok().body(result)
        } catch (e: Exception) {
            return ResponseEntity.status(400).body(e.message)
        }
    }

    @PostMapping(path = ["/{uuid}/sql/initialize"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializeSQLContainer(@PathVariable uuid: String, @RequestPart("file", required = false) file: MultipartFile?): ResponseEntity<Any> {
        val containerFile: File
        if (file == null) {
            containerFile = File("src/main/resources/defaultContainers/SQLDockerfile")
        } else {
            containerFile = File.createTempFile(file.name, null)
            file.transferTo(containerFile)
        }

        try {
            SQLExecutor.startContainer(uuid, containerFile)
            return ResponseEntity.ok().build()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(e.message)
        }
    }

    @PostMapping("/{uuid}/sql/test")
    fun testSQLCode(@PathVariable uuid: String, @RequestBody() codeStrings: Map<String, String>): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }
        try {
            val result = SQLExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
            return ResponseEntity.ok().body(result)
        } catch (e: Exception) {
            return ResponseEntity.status(400).body(e.message)
        }
    }

    @PostMapping("/{uuid}/cleanup")
    fun cleanupContainers(@PathVariable uuid: String): ResponseEntity<Any> {
        CodeExecutor.stopContainers(uuid)
        return ResponseEntity.ok().build()
    }
}