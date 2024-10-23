package ut.isep.interview.api

import models.Section
import models.Test
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @GetMapping("/test")
    fun getTest(): Test {
        //TODO implement
        return Test(0, listOf())
    }

    @PostMapping("/test/{applicantId}/submit/{sectionId}")
    fun postTestSubmit(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: Section) {
        //TODO implement
    }

    @PostMapping("/test/{applicantId}/cash/{sectionId}")
    fun postTestCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: Section) {
        //TODO implement
    }

    @GetMapping("/test/{applicantId}/cash/{sectionId}")
    fun getTestCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int): Section {
        //TODO implement
        return Section("StubTitle", listOf())
    }
}