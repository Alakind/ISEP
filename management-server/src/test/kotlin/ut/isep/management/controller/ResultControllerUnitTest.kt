package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.assignment.ResultAssignmentUpdateDTO
import dto.scorecomparison.ScoreComparisonReadDTO
import dto.section.ResultSectionReadDTO
import dto.section.ResultSectionSimpleReadDTO
import dto.section.SectionInfo
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
import ut.isep.management.service.solution.ResultReadService
import ut.isep.management.service.solution.ResultUpdateService
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ResultControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    private lateinit var resultReadService: ResultReadService

    @MockkBean
    private lateinit var resultUpdateService: ResultUpdateService

    private val inviteId: UUID = UUID.randomUUID()

    @Test
    fun `test section 1 is returned`() {
        // variables
        val resultSectionReadDTO = ResultSectionReadDTO(
            SectionInfo(id = 1L, title = "Java", availablePoints = 10, availableSeconds = 900), assignments = listOf(),
            scoredPoints = 3, measuredSeconds = 500
        )

        // given
        every { resultReadService.getResultSection(inviteId, 1L) } returns resultSectionReadDTO

        // verify and assert
        mockMvc.perform(
            get("/section/1/result/$inviteId")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(resultSectionReadDTO.sectionInfo.id))
            .andExpect(jsonPath("$.title").value(resultSectionReadDTO.sectionInfo.title))
    }

    @Test
    fun `test 'Updated an assignment' is returned when applicant 1 is updated`() {
        // variables
        val resultAssignmentUpdateDTO = ResultAssignmentUpdateDTO(id = "1", scoredPoints = 2)

        // given
        every { resultUpdateService.updateAssignment(inviteId, resultAssignmentUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/assignment/1/result/$inviteId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultAssignmentUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated an assignment"))
    }

    @Test
    fun `test list of results by assessment`() {
        // variables
        val resultSectionSimple1ReadDTO = ResultSectionSimpleReadDTO(title = "Java", availablePoints = 10, availableSeconds = 900, scoredPoints = 3, measuredSeconds = 500)
        val resultSectionSimple2ReadDTO = ResultSectionSimpleReadDTO(title = "SQL", availablePoints = 5, availableSeconds = 700, scoredPoints = 1, measuredSeconds = 700)

        // given
        every { resultReadService.getResultByAssessment(inviteId, 1L) } returns listOf(resultSectionSimple1ReadDTO, resultSectionSimple2ReadDTO)

        // verify and assert
        mockMvc.perform(
            get("/assessment/1/result/$inviteId")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].title").value(resultSectionSimple1ReadDTO.title))
            .andExpect(jsonPath("$[1].title").value(resultSectionSimple2ReadDTO.title))
    }

    @Test
    fun `test get score comparison`() {
        // variables
        val scoreComparisonReadDTO = ScoreComparisonReadDTO(percentage = 73.05F, distributionGroups = listOf(10.0F, 20.0F, 30.0F, 40.0F, 50.0F, 50.0F, 40.0F, 30.0F, 20.0F, 10.0F), selectedGroup = 2)

        // given
        every { resultReadService.computeScoreComparison(inviteId) } returns scoreComparisonReadDTO

        // verify and assert
        mockMvc.perform(
            get("/result/$inviteId/comparison")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.percentage").value(scoreComparisonReadDTO.percentage))
            .andExpect(jsonPath("$.distributionGroups.size()").value(10))
            .andExpect(jsonPath("$.selectedGroup").value(scoreComparisonReadDTO.selectedGroup))
    }
}