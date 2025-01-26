package ut.isep.interview.api

import jakarta.servlet.http.HttpServletRequest
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

    @PostMapping(path = ["/{uuid}/sql/initialize", "/{uuid}/python/initialize", "/{uuid}/java/initialize"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializeSQLContainer(@PathVariable uuid: String,
                               @RequestPart("file", required = false) file: MultipartFile?,
                               request: HttpServletRequest): ResponseEntity<Any> {
        val containerFile: File
        val path = request.requestURI
        if (file == null) {
            containerFile = when {
                path.contains("/sql/") -> File("src/main/resources/defaultContainers/SQLDockerfile")
                path.contains("/python/") -> File("src/main/resources/defaultContainers/PythonDockerfile")
                path.contains("/java/") -> File("src/main/resources/defaultContainers/JavaDockerfile")
                else -> throw IllegalArgumentException("Unsupported language: $path")
            }
        } else {
            containerFile = File.createTempFile(file.name, null)
            file.transferTo(containerFile)
        }

        try {
            when {
                path.contains("/sql/") -> SQLExecutor.startContainer(uuid, containerFile)
                path.contains("/python/") -> PythonExecutor.startContainer(uuid, containerFile)
                path.contains("/java/") -> JavaExecutor.startContainer(uuid, containerFile)
                else -> return ResponseEntity.badRequest().body("The requested language is not supported.")
            }
            return ResponseEntity.ok().build()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(e.message)
        }
    }

    @PostMapping(path = ["/{uuid}/sql/test", "/{uuid}/python/test", "/{uuid}/java/test"])
    fun testSQLCode(@PathVariable uuid: String,
                    @RequestBody() codeStrings: Map<String, String>,
                    request: HttpServletRequest): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }
        val path = request.requestURI
        try {
            val result = when {
                path.contains("/sql/") -> SQLExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
                path.contains("/python/") -> PythonExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
                path.contains("/java/") -> JavaExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"])
                else -> return ResponseEntity.badRequest().body("The requested language is not supported.")
            }
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