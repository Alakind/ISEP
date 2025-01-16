package ut.isep.interview.api

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ut.isep.interview.code_execution.CodeExecutor
import java.io.File
import java.nio.file.Files
import kotlin.io.path.exists

@RestController
@RequestMapping("/code-executor")
class CodeExecution {
    // Python, C#, SQL, Java, and JavaScript

    @PostMapping(path = ["/{uuid}/java/initialize"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initializeJavaContainer(@PathVariable uuid: String, @RequestPart("file") file: MultipartFile): ResponseEntity<Any> {
        val temp = File.createTempFile(file.name, null)
        file.transferTo(temp)
        CodeExecutor.startJavaContainer(uuid, temp)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/{uuid}/java/test")
    fun testJavaCode(@PathVariable uuid: String, @RequestBody() codeStrings: Map<String, String>): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }

        val dir = Files.createTempDirectory(uuid)
        val code = dir.resolve("Code.java").toFile()
        code.writeText(codeStrings["code"]!!)

        val test = dir.resolve("Test.java").toFile()
        if (!test.exists() && !codeStrings.containsKey("test")) {
            return ResponseEntity.badRequest().body("A file containing tests should be provided")
        }
        if (codeStrings.containsKey("test")) {
            test.writeText(codeStrings["test"]!!)
        }

        return ResponseEntity.ok().body(CodeExecutor.runJavaTest(uuid, code, test))
    }

    @PostMapping("/{uuid}/cleanup")
    fun cleanupContainers(@PathVariable uuid: String): ResponseEntity<Any> {
        CodeExecutor.stopContainers(uuid)
        return ResponseEntity.ok().build()
    }
}