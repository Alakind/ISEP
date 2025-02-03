package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.timing.TimingPerSectionInSecondsUpdateDTO
import dto.timing.TimingPerSectionReadDTO
import dto.timing.TimingPerSectionSwitchUpdateDTO
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
import ut.isep.management.service.timing.TimingPerSectionReadService
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class TimingControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    private lateinit var timingPerSectionReadService: TimingPerSectionReadService

    @MockkBean
    private lateinit var timingPerSectionUpdateService: TimingPerSectionUpdateService

    private val inviteId1 = UUID.randomUUID()


    @Test
    fun `test 'Updated measuredTime' is returned when timing of section 1 is updated`() {
        // variables
        val timingInSecondsUpdateDTO = TimingPerSectionInSecondsUpdateDTO(id = 1L, seconds = 57)

        // given
        every { timingPerSectionUpdateService.updateTiming(inviteId1, timingInSecondsUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/timing/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(timingInSecondsUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated measuredTime"))
    }

    @Test
    fun `test 'Updated measuredTime' is returned when switch from section 1 to 2`() {
        // variables
        val timingSwitchUpdateDTO = TimingPerSectionSwitchUpdateDTO(id = 2L, seconds = null)

        // given
        every { timingPerSectionUpdateService.updateTiming(inviteId1, timingSwitchUpdateDTO) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/timing/$inviteId1/switch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(timingSwitchUpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated measuredTime"))
    }

    @Test
    fun `test timing for section 1 is returned`() {
        // variables
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(seconds = 57)

        // given
        every { timingPerSectionReadService.getByMeasuredTimeSectionId(inviteId1, 1L) } returns timingPerSectionReadDTO

        // verify and assert
        mockMvc.perform(
            get("/section/1/timing/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.seconds").value(timingPerSectionReadDTO.seconds))
    }

    @Test
    fun `test timing for invite is returned`() {
        // variables
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(seconds = 3000)

        // given
        every { timingPerSectionReadService.getMeasuredTimeInvite(inviteId1) } returns timingPerSectionReadDTO

        // verify and assert
        mockMvc.perform(
            get("/timing/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.seconds").value(timingPerSectionReadDTO.seconds))
    }

    @Test
    fun `test time left for invite is returned`() {
        // variables
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(seconds = 3000)

        // given
        every { timingPerSectionReadService.getTimeLeft(inviteId1) } returns timingPerSectionReadDTO

        // verify and assert
        mockMvc.perform(
            get("/timing/$inviteId1/left")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.seconds").value(timingPerSectionReadDTO.seconds))
    }
}