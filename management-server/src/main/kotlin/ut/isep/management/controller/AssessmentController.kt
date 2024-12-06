package ut.isep.management.controller

import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ut.isep.management.service.AssessmentService


@RestController
@RequestMapping("/asessment")
@Tag(name = "Assessment")
class AssessmentController(val assessmentService: AssessmentService) {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all assessment IDs",
    )
    fun getAssessmentIDs(): List<Long> {
       return assessmentService.allAssessmentIDs
    }
}
