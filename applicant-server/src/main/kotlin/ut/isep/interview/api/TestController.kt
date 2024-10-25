package ut.isep.interview.api

import dto.SectionDTO
import dto.QuestionnaireDTO
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @GetMapping("/test")
    fun getTest(): QuestionnaireDTO {
        //TODO implement
        return QuestionnaireDTO(0, listOf())
    }

    @PostMapping("/test/{applicantId}/submit/{sectionId}")
    fun postTestSubmit(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: SectionDTO) {
        //TODO implement
    }

    @PostMapping("/test/{applicantId}/cash/{sectionId}")
    fun postTestCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int, @RequestBody section: SectionDTO) {
        //TODO implement
    }

    @GetMapping("/test/{applicantId}/cash/{sectionId}")
    fun getTestCash(@PathVariable applicantId: Int, @PathVariable sectionId: Int): SectionDTO {
        //TODO implement
        return SectionDTO("StubTitle", listOf())
    }
}