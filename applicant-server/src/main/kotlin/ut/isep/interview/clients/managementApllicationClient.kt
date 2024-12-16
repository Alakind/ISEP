package ut.isep.interview.clients

import dto.AnswerDTO
import dto.AssessmentDTO
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@FeignClient("management-server", url = "localhost:8081")
interface ManagementApplicationClient {
    @GetMapping("/applicant/{applicantId}/interview")
    fun getInterview(@PathVariable applicantId: Long): AssessmentDTO

    @PostMapping("/applicant/{applicantId}/submit")
    fun postSubmit(@PathVariable applicantId: Long, @RequestBody interview: List<AnswerDTO>)
}
