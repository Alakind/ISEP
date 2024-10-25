package ut.isep.interview.api

import dto.StatusDTO
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class TestStatusController {

    @GetMapping("/testStatus/{applicantId}")
    fun getTestStatus(@PathVariable applicantId: String): StatusDTO {
        //TODO implement
        return StatusDTO(mapOf())
    }
}