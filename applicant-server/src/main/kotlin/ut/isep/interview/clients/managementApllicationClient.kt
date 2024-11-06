package ut.isep.interview.clients

import dto.InterviewDTO
import dto.SectionDTO
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@FeignClient("management-server", url = "localhost:8081")
interface ManagementApplicationClient {
    @GetMapping("/test/{applicantId}/test")
    fun getTest(@PathVariable applicantId: Int?): InterviewDTO?

    @PostMapping("/test/{applicantId}/submit")
    fun postSubmit(@PathVariable applicantId: Int?)

    @PostMapping("/test/{applicantId}/save/{sectionId}")
    fun postSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?)

    @GetMapping("/test/{applicantId}/save/{sectionId}")
    fun getSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?): SectionDTO?

    @GetMapping("/section/{sectionId}")
    fun getSection(@PathVariable sectionId: Int?): SectionDTO?
}