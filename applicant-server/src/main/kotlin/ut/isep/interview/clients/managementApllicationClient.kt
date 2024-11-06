package ut.isep.interview.clients

import dto.InterviewDTO
import dto.SectionDTO
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@FeignClient("management-server", url = "localhost:8081")
interface ManagementApplicationClient {
    @GetMapping("/interview/{applicantId}")
    fun getTest(@PathVariable applicantId: Int?): InterviewDTO

    @PostMapping("/interview/{applicantId}/submit")
    fun postSubmit(@PathVariable applicantId: Int?)

    @PostMapping("/interview/{applicantId}/save/{sectionId}")
    fun postSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?)

    @GetMapping("/interview/{applicantId}/save/{sectionId}")
    fun getSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?): SectionDTO

    @GetMapping("/section/{sectionId}")
    fun getSection(@PathVariable sectionId: Int?): SectionDTO
}