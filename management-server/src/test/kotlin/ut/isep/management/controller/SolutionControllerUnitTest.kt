package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.assignment.SolvedAssignmentCodingReadDTO
import dto.assignment.SolvedAssignmentMultipleChoiceReadDTO
import dto.assignment.SolvedAssignmentOpenReadDTO
import dto.section.SectionInfo
import dto.section.SolvedSectionReadDTO
import dto.solution.AnswerCreateReadDTO
import dto.solution.SolutionsUpdateDTO
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.solution.SolutionReadService
import ut.isep.management.service.solution.SolutionUpdateService
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class SolutionControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    private val inviteId1 = UUID.randomUUID()

    @MockkBean
    private lateinit var inviteReadService: InviteReadService

    @MockkBean
    private lateinit var solutionReadService: SolutionReadService

    @MockkBean
    private lateinit var solutionUpdateService: SolutionUpdateService

    @Test
    fun `test 'Updated 1 solution'  is returned when solution of open assignment 1 is updated`() {
        // variables
        val solutionsUpdateDTO = SolutionsUpdateDTO().apply {
            this["1"] = AnswerCreateReadDTO.Open(answer = "This is the new answer")
        }

        // given
        every { inviteReadService.checkAccessibilityAssessment(inviteId1) } returns Unit
        every { solutionUpdateService.updateSolutions(inviteId1, solutionsUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/solution/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(solutionsUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated 1 solutions"))
    }

    @Test
    fun `test 'Updated 1 solution'  is returned when solution of multiple choice assignment 1 is updated`() {
        // variables
        val solutionsUpdateDTO = SolutionsUpdateDTO().apply {
            this["1"] = AnswerCreateReadDTO.MultipleChoice(answer = listOf("Option 2", "Option 3"))
        }

        // given
        every { inviteReadService.checkAccessibilityAssessment(inviteId1) } returns Unit
        every { solutionUpdateService.updateSolutions(inviteId1, solutionsUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/solution/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(solutionsUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated 1 solutions"))
    }

    @Test
    fun `test 'Updated 1 solution'  is returned when solution of coding assignment 1 is updated`() {
        // variables
        val solutionsUpdateDTO = SolutionsUpdateDTO().apply {
            this["1"] = AnswerCreateReadDTO.Coding(
                code = "console.log('test')",
                test = "this is a test"
            )
        }

        // given
        every { inviteReadService.checkAccessibilityAssessment(inviteId1) } returns Unit
        every { solutionUpdateService.updateSolutions(inviteId1, solutionsUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/solution/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(solutionsUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated 1 solutions"))
    }

    @Test
    fun `test 'Updated 3 solution'  is returned when solution of open, multiple choice and coding assignment 1,2,3 is updated`() {
        // variables
        val solutionsUpdateDTO = SolutionsUpdateDTO()
            .apply {
                this["1"] = AnswerCreateReadDTO.Open(answer = "This is the new answer")
            }
            .apply {
                this["2"] = AnswerCreateReadDTO.MultipleChoice(answer = listOf("Option 2", "Option 3"))
            }
            .apply {
                this["3"] = AnswerCreateReadDTO.Coding(
                    code = "console.log('test')",
                    test = "this is a test"
                )
            }

        // given
        every { inviteReadService.checkAccessibilityAssessment(inviteId1) } returns Unit
        every { solutionUpdateService.updateSolutions(inviteId1, solutionsUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/solution/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(solutionsUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated 3 solutions"))
    }


    @Test
    fun `test solved assignment list is returned with name and email example`() {
        // variables
        val solvedAssignment1 = SolvedAssignmentOpenReadDTO(
            id = 1L,
            description = "This is an open solved assignment",
            answer = AnswerCreateReadDTO.Open(
                answer = "This is a answer"
            )
        )
        val solvedAssignment2 = SolvedAssignmentMultipleChoiceReadDTO(
            id = 2L,
            description = "This is an multiple choice solved assignment",
            options = listOf("Option 1", "Option 2", "Option 3"),
            isMultipleAnswers = true,
            answer = AnswerCreateReadDTO.MultipleChoice(
                answer = listOf("Option 2", "Option 3"),
            )
        )
        val solvedAssignment3 = SolvedAssignmentCodingReadDTO(
            id = 3L,
            description = "This is an coding solved assignment",
            language = "Java",
            startCode = "startCode",
            startTest = "StartTest",
            answer = AnswerCreateReadDTO.Coding(
                code = "console.log('test')",
                test = "this is a test"
            )
        )
        val solvedSectionReadDTO = SolvedSectionReadDTO(
            SectionInfo(id = 1L, title = "Java", availablePoints = 10, availableSeconds = 900), assignments = listOf(
                solvedAssignment1,
                solvedAssignment2, solvedAssignment3
            )
        )

        // given
        every { solutionReadService.getSolvedSection(inviteId1, 1L) } returns solvedSectionReadDTO

        // verify and assert
        mockMvc.perform(
            get("/section/1/solution/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .param("name", "John")
                .param("email", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(solvedSectionReadDTO.sectionInfo.id))
            .andExpect(jsonPath("$.title").value(solvedSectionReadDTO.sectionInfo.title))
            .andExpect(jsonPath("$.assignments[0].description").value(solvedAssignment1.description))
            .andExpect(jsonPath("$.assignments[1].description").value(solvedAssignment2.description))
            .andExpect(jsonPath("$.assignments[2].description").value(solvedAssignment3.description))
    }
}