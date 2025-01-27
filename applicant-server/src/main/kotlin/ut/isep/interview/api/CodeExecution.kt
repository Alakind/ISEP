package ut.isep.interview.api

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ut.isep.interview.code_execution.utils.CodeExecutorUtils
import ut.isep.interview.code_execution.JavaExecutor
import ut.isep.interview.code_execution.PythonExecutor
import ut.isep.interview.code_execution.SQLExecutor
import ut.isep.interview.code_execution.dto.Test
import java.io.File

@RestController
@RequestMapping("/code-executor")
class CodeExecution {
    // Python, C#, SQL, Java, and JavaScript

    @PostMapping(path = ["/{uuid}/sql/initialize", "/{uuid}/python/initialize", "/{uuid}/java/initialize"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializeContainer(@PathVariable uuid: String,
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
    fun testCode(@PathVariable uuid: String,
                    @RequestBody() codeStrings: Test,
                    request: HttpServletRequest): ResponseEntity<Any> {
        val path = request.requestURI
        try {
            val result = when {
                path.contains("/sql/") -> SQLExecutor.runTest(uuid, codeStrings)
                path.contains("/python/") -> PythonExecutor.runTest(uuid, codeStrings)
                path.contains("/java/") -> JavaExecutor.runTest(uuid, codeStrings)
                else -> return ResponseEntity.badRequest().body("The requested language is not supported.")
            }
            return ResponseEntity.ok().body(result)
        } catch (e: Exception) {
            return ResponseEntity.status(400).body(e.message)
        }
    }

    @PostMapping("/{uuid}/cleanup")
    fun cleanupContainers(@PathVariable uuid: String): ResponseEntity<Any> {
        CodeExecutorUtils.stopContainers(uuid)
        return ResponseEntity.ok().build()
    }
}