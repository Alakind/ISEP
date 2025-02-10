package ut.isep.management.controller

import com.ninjasquad.springmockk.MockkBean
import dto.assignment.ReferenceAssignmentOpenReadDTO
import dto.solution.AnswerCreateReadDTO
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.service.assignment.ReferenceAssignmentReadService

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class AssignmentControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var assignmentReadService: ReferenceAssignmentReadService

    private val assignment1 = Assignment(id = 1L, assignmentType = AssignmentType.OPEN, availableSeconds = 300, availablePoints = 2)
    private val assignment1ReadDTO = ReferenceAssignmentOpenReadDTO(
        id = 1L, description = "Answer this question", availableSeconds = 300, availablePoints = 2, referenceAnswer =
            AnswerCreateReadDTO.Open(answer = "This is an answer")
    )

    @Test
    fun `test assignment 1 is returned`() {
        // given
        every { assignmentReadService.getById(assignment1.id, "scsoivu0u2dco8uvd8moiej8ofuj") } returns assignment1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/assignment/1")
                .contentType(MediaType.APPLICATION_JSON)
                .param("commit", "scsoivu0u2dco8uvd8moiej8ofuj")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.availableSeconds").value(300))
    }
}