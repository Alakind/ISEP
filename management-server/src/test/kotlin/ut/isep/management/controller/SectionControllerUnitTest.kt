package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.section.SectionInfo
import dto.section.SectionReadDTO
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
import ut.isep.management.service.section.SectionReadService

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class SectionControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    private lateinit var sectionReadService: SectionReadService

    private val section1ReadDTO = SectionReadDTO(
        SectionInfo(id = 1L, title = "Java", availablePoints = 10, availableSeconds = 900), assignments = listOf(),
        size = 3
    )
    private val section2ReadDTO = SectionReadDTO(
        SectionInfo(id = 2L, title = "SQL", availablePoints = 5, availableSeconds = 700), assignments = listOf(),
        size = 2
    )

    @Test
    fun `test section ids list is returned`() {
        // given
        every { sectionReadService.getAllIds() } returns listOf(section1ReadDTO.sectionInfo.id, section2ReadDTO.sectionInfo.id)

        // verify and assert
        mockMvc.perform(
            get("/section/id")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.size()").value(2))
            .andExpect(jsonPath("$[0]").value(1L))
            .andExpect(jsonPath("$[1]").value(2L))
    }

    @Test
    fun `test section list is returned`() {
        // given
        every { sectionReadService.getAll() } returns listOf(section1ReadDTO, section2ReadDTO)

        // verify and assert
        mockMvc.perform(
            get("/section")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.size()").value(2))
            .andExpect(jsonPath("$[0].id").value(section1ReadDTO.sectionInfo.id))
            .andExpect(jsonPath("$[1].id").value(section2ReadDTO.sectionInfo.id))
    }

    @Test
    fun `test section 1 is returned`() {
        // given
        every { sectionReadService.getById(1L) } returns section1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/section/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(section1ReadDTO.sectionInfo.id))
            .andExpect(jsonPath("$.title").value(section1ReadDTO.sectionInfo.title))
    }
}