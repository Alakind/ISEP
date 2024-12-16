package ut.isep.management.controller

import dto.ApplicantDTO
import dto.AssessmentDTO
import enumerable.ApplicantStatus
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.model.pgsql.Applicant
import ut.isep.management.model.pgsql.AssignmentMultipleChoice
import ut.isep.management.model.pgsql.AssignmentOpen
import ut.isep.management.model.pgsql.Section
import ut.isep.management.service.ApplicantService
import ut.isep.management.service.toDTO

@RestController
@RequestMapping("/applicant")
class ApplicantController(val applicantService: ApplicantService) {


    @GetMapping
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all applicants",
    )
    fun getApplicants(): List<ApplicantDTO> {
        return applicantService.allApplicants
    }

    @GetMapping("{id}")
    @Operation(summary = "Get applicant", description = "Returns either ApplicantDTO or 404 if not found")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the applicant",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
                content = [Content(
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getApplicant(@PathVariable id: Long): ResponseEntity<ApplicantDTO> {
        return try {
            ResponseEntity.ok(applicantService.getApplicantById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(summary = "Adds an applicant", description = "Add an applicant to the PostGreSQL Management database")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Added the applicant",
            )
        ]
    )
    fun postApplicant(@RequestBody applicant: ApplicantDTO): ResponseEntity<String> {
        applicantService.addApplicant(applicant)
        return ResponseEntity.ok("Added an applicant")
    }

    @GetMapping("/add")
    @Operation(summary = "Adds a stub applicant", description = "Transient testing method")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Added the applicant",
            )
        ]
    )
    fun postStubApplicant(): ResponseEntity<String> {
        applicantService.addApplicant(
            Applicant(
                status = ApplicantStatus.app_finished,
                interview = null,
                preferredLanguage = null
            )
        )
        return ResponseEntity.ok("Added an applicant")
    }

    @GetMapping("/{applicantId}/interview")
    @Operation(
        summary = "Get the interview for the applicant",
        description = "Returns a list with all the sectionsID's"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the interview",
            ),
            ApiResponse(
                responseCode = "404",
                description = "Applicant not found",
                content = [Content(
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getInterview(@PathVariable applicantId: Int): ResponseEntity<AssessmentDTO> {
        //TODO implement

        val assignment1 = AssignmentMultipleChoice(
            description = "What will I get if I will sum 2 and 2?",
            options = listOf("42", "Isaac Newton", "Madagascar"),
            isMultipleAnswers = false,
        )

        val assignment2 = AssignmentMultipleChoice(
            description = "Which member(s) should receive a red card?",
            options = listOf("Aleks", "Jarno", "Jesse", "Ruben", "Everard"),
            isMultipleAnswers = true
        )

        val assignment3 = AssignmentMultipleChoice(
            description = "You are a 15th century plague doctor, please cure this sick person",
            options = listOf("Mouse bites", "Leeches", "More mouse bites", "All of the above"),
            isMultipleAnswers = false
        )

        val assignment4 = AssignmentMultipleChoice(
            description = "How Long is a Chinese person",
            options = listOf("Option A", "169.7 cm (5 ft 7 in)", "Trick question"),
            isMultipleAnswers = false
        )

        val openAssignment1 = AssignmentOpen(
            description = "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon."
        )

        val openAssignment2 = AssignmentOpen(
            description = "Prove whether or not P = NP in 150 words"
        )

        val section1 = Section(
            title = "Demo Section 1",
            assignments = setOf(assignment1, assignment2, openAssignment1)
        )

        // Create a Section with these assignments
        val section2 = Section(
            title = "Demo Section 2",
            assignments = setOf(assignment3, assignment4, openAssignment2)
        )
        return ResponseEntity.ok(AssessmentDTO(69, listOf(
            section1.toDTO(), section2.toDTO()
        )))
    }

    @PostMapping("/{applicantId}/submit")
    @Operation(summary = "Submits the interview", description = "All saved answers will now be submitted")
    @ApiResponses(
        value = [
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
        ]
    )
    fun postInterviewSubmit(@PathVariable applicantId: Int, @RequestBody interview: AssessmentDTO) {
        //TODO implement
    }
}
