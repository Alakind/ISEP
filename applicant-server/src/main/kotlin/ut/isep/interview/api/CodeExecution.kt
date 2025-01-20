package ut.isep.interview.api

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ut.isep.interview.code_execution.CodeExecutor
import ut.isep.interview.code_execution.JavaExecutor
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
        JavaExecutor.startContainer(uuid, temp)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/{uuid}/java/test")
    fun testJavaCode(@PathVariable uuid: String, @RequestBody() codeStrings: Map<String, String>): ResponseEntity<Any> {
        if (!codeStrings.containsKey("code")) {
            return ResponseEntity.badRequest().body("You must provide code with your request")
        }

        return ResponseEntity.ok().body(JavaExecutor.runTest(uuid, codeStrings["code"]!!, codeStrings["test"]))
    }

    @PostMapping("/{uuid}/cleanup")
    fun cleanupContainers(@PathVariable uuid: String): ResponseEntity<Any> {
        CodeExecutor.stopContainers(uuid)
        return ResponseEntity.ok().build()
    }
}