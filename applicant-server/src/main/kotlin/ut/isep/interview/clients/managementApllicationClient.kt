package ut.isep.interview.clients

import dto.AssessmentReadDTO
import dto.SectionReadDTO
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@FeignClient("management-server", url = "localhost:8081")
interface ManagementApplicationClient {
    @GetMapping("/applicant/{applicantId}/interview")
    fun getInterview(@PathVariable applicantId: Int?): AssessmentReadDTO

    @PostMapping("/applicant/{applicantId}/submit")
    fun postSubmit(@PathVariable applicantId: Int?)

    @PostMapping("/applicant/{applicantId}/save-section/{sectionId}")
    fun postSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?)

    @GetMapping("/applicant/{applicantId}/save-section/{sectionId}")
    fun getSaveSection(@PathVariable applicantId: Int, @PathVariable sectionId: Int?): SectionReadDTO

    @GetMapping("/section/{sectionId}")
    fun getSection(@PathVariable sectionId: Int?): SectionReadDTO
}
