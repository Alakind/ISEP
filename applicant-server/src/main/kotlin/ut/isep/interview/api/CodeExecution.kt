package ut.isep.interview.api

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ut.isep.interview.code_execution.CodeExecutor
import java.io.File

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

    @PostMapping(path = ["/{uuid}/java/test"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun testJavaCode(@PathVariable uuid: String, @RequestPart("files") files: List<MultipartFile>): ResponseEntity<Any> {
        if (files.size != 2) {
            return ResponseEntity.badRequest().body("You must provide 2 files")
        }
        var test:File? = null
        var code:File? = null

        val dir = File.createTempFile(uuid, System.nanoTime().toString());
        dir.delete()
        dir.mkdir()
        for (file in files) {
            val temp = File(dir, file.originalFilename!!)
            file.transferTo(temp)
            if (file.originalFilename!!.startsWith("Test")) {
                test = temp
            } else {
                code = temp
            }
        }
        if (code == null) {
            return ResponseEntity.badRequest().body("You must provide a file with code not starting with \"Test\"")
        }
        if (test == null) {
            return ResponseEntity.badRequest().body("You must provide a file containing test with a filename starting with \"Test\"")
        }
        val result = CodeExecutor.runJavaTest(uuid, code, test)
        return ResponseEntity.ok().body(result)
    }

    @PostMapping("/{uuid}/cleanup")
    fun cleanupContainers(@PathVariable uuid: String): ResponseEntity<Any> {
        CodeExecutor.stopContainers(uuid)
        return ResponseEntity.ok().build()
    }
}