package ut.isep.management.controller

import com.ninjasquad.springmockk.MockkBean
import dto.PaginatedDTO
import dto.assessment.AssessmentReadDTO
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.Assessment
import ut.isep.management.service.assessment.AssessmentReadService

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class AssessmentControllerUnitTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var assessmentReadService: AssessmentReadService

    private val assessment1 = Assessment(id = 1L, tag = "Java developer", gitCommitHash = "advw4fdve4tfdafvaserawef", latest = false)
    private val assessment2 = Assessment(id = 2L, tag = "Java developer", gitCommitHash = "avfoifdjvnlnroifdofvnoud", latest = true)

    private val assessment1ReadDTO = AssessmentReadDTO(id = 1L, tag = "Java developer", commit = "advw4fdve4tfdafvaserawef", availableSeconds = 1200, sections = listOf(1, 2))
    private val assessment2ReadDTO = AssessmentReadDTO(id = 2L, tag = "Java developer", commit = "avfoifdjvnlnroifdofvnoud", availableSeconds = 900, sections = listOf(3, 4))

    @Test
    fun `test paginated assessments list is returned`() {
        // given
        every { assessmentReadService.getLatestPaginated(any<Pageable>()) } returns PaginatedDTO(1, listOf(assessment2ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/assessment")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].commit").value("avfoifdjvnlnroifdofvnoud"))
    }

    @Test
    fun `test assessment 1 is returned`() {
        // given
        every { assessmentReadService.getById(1) } returns assessment1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/assessment/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.commit").value(assessment1.gitCommitHash))
    }
}