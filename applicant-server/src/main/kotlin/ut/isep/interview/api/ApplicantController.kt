package ut.isep.interview.api

import dto.AnswerDTO
import dto.AssessmentSmallDTO
import dto.AssignmentDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.interview.clients.ManagementApplicationClient
import ut.isep.interview.model.Assignment
import ut.isep.interview.service.QuestionService
import ut.isep.interview.service.toDTO

@RestController
@RequestMapping("/applicant")
class ApplicantController(
    val client: ManagementApplicationClient,
    val questionService: QuestionService
) {

    @GetMapping("/{applicantId}/interview")
    @Operation(summary = "Get the Interview for the applicant", description = "Returns a list with all the sectionsID's")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the Interview",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getInterview(@PathVariable applicantId: Long): ResponseEntity<AssessmentSmallDTO> {
        return ResponseEntity.ok(questionService.setAssessmentDTO(client.getInterview(applicantId)).toDTO())
    }

    @GetMapping("/{applicantId}/section/{sectionId}")
    @Operation(summary = "Get the section for the applicant", description = "Returns a list with all answers in the section")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Found the Section",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun getSection(@PathVariable applicantId: Long, @PathVariable sectionId: Int): ResponseEntity<List<AssignmentDTO>> {
        val section: List<Assignment> = questionService.getAssignmentsInSection(applicantId, sectionId)
        if (section.isEmpty()) {
            return ResponseEntity.notFound().build()
        }
        return ResponseEntity.ok(section.map { it.toDTO() })
    }

    @PostMapping("/{applicantId}/finish")
    @Operation(summary = "Submits the Interview", description = "All saved answers will now be submitted")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Submitted successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun postInterviewSubmit(@PathVariable applicantId: Long) {
        client.postSubmit(applicantId, questionService.getAllAnswers(applicantId))
        questionService.deleteAssessment(applicantId)
    }

    @PostMapping("/{applicantId}/save-answers")
    @Operation(summary = "Caches the section", description = "The provided answers will be saved")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Saved the section successfully",
        ),
        ApiResponse(
            responseCode = "400",
            description = "The provided section does not belong to the section id",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        ),
        ApiResponse(
            responseCode = "404",
            description = "Applicant or Section not found",
            content = [Content(
                schema = Schema(implementation = DefaultErrorAttributes::class)
            )]
        )
    ])
    fun postSaveSection(@PathVariable applicantId: Long, @RequestBody answers: List<AnswerDTO>) {
        questionService.setAnswers(applicantId, answers)
    }
//
//    @GetMapping("/{applicantId}/save-answer/{questionId}")
//    @Operation(summary = "Get the saved answer", description = "Retrieves the saved answer")
//    @ApiResponses(value = [
//        ApiResponse(
//            responseCode = "200",
//            description = "Retrieved the section successfully",
//        ),
//        ApiResponse(
//            responseCode = "404",
//            description = "Applicant or Section not found",
//            content = [Content(
//                schema = Schema(implementation = DefaultErrorAttributes::class)
//            )]
//        )
//    ])
//    fun getSaveAnswer(@PathVariable applicantId: Long, @PathVariable questionId: Long): ResponseEntity<AnswerDTO>? {
//        return ResponseEntity.ok(answerService.getAnswer(applicantId, questionId))
//    }
}
