package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.email.EmailCreateDTO
import enumerable.EmailType
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.email.MailSenderService
import java.time.OffsetDateTime
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class EmailControllerUnitTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private val objectMapper = ObjectMapper()

    @MockkBean
    private lateinit var emailService: MailSenderService

    private val inviteId1: UUID = UUID.randomUUID()
    private val invite1: Invite = Invite(inviteId1)
    private val emailCreateDTO = EmailCreateDTO(applicantId = 1L, inviteId = inviteId1, type = EmailType.invitation, additionalMessage = "")

    private val applicant1 = Applicant(id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = mutableListOf(invite1), createdAt = OffsetDateTime.now())

    @Test
    fun `test mail send`() {
        // given
        every { emailService.checkData(any()) } returns Pair(applicant1, invite1)
        every { emailService.processMail(any(), applicant1, invite1) } returns Unit

        // verify and assert
        mockMvc.perform(
            post("/send-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailCreateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Email request has been received"))
    }
}