package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.assignment.TestResultCreateDTO
import dto.assignment.TestResultUpdateDTO
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.solution.TestResultCreateService
import ut.isep.management.service.solution.TestResultUpdateService
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class TestResultControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    private lateinit var testResultCreateService: TestResultCreateService

    @MockkBean
    private lateinit var testResultUpdateService: TestResultUpdateService

    private val inviteId1 = UUID.randomUUID()

    @Test
    fun `test 'Added a test result' and location is returned when test result 2 is created`() {
        // variables
        val testResultDTO = TestResultCreateDTO(assignmentId = 1L, inviteId = inviteId1, name = "test result 1", message = "parameter can't be null", passed = false)
        val testResult = TestResult(id = 2L, name = testResultDTO.name, message = testResultDTO.message, passed = testResultDTO.passed)

        // given
        every { testResultCreateService.create(testResultDTO) } returns testResult

        // verify and assert
        mockMvc.perform(
            post("/test-result")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testResultDTO))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Added a test result"))
            .andExpect(header().string("Location", "http://localhost/test-result/${testResult.id}"))
    }

    @Test
    fun `test 'Updated a test result' is returned when test result 1 is updated`() {
        // variables
        val testResultDTO = TestResultUpdateDTO(id = 1L, assignmentId = 1L, inviteId = inviteId1, name = "test result 1", message = "parameter can't be null", passed = false)

        // given
        every { testResultUpdateService.update(testResultDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/test-result")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testResultDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated a test result"))
    }
}