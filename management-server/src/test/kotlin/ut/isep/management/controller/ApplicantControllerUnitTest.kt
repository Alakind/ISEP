package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.PaginatedDTO
import dto.applicant.ApplicantCreateDTO
import dto.applicant.ApplicantReadDTO
import dto.applicant.ApplicantUpdateDTO
import dto.invite.InviteReadDTO
import enumerable.InviteStatus
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Example
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.applicant.ApplicantCreateService
import ut.isep.management.service.applicant.ApplicantReadService
import ut.isep.management.service.applicant.ApplicantUpdateService
import java.time.OffsetDateTime
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ApplicantControllerUnitTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    lateinit var applicantReadService: ApplicantReadService

    @MockkBean
    lateinit var applicantCreateService: ApplicantCreateService

    @MockkBean
    private lateinit var applicantUpdateService: ApplicantUpdateService

    private val inviteId1: UUID = UUID.randomUUID()
    private val inviteId2: UUID = UUID.randomUUID()
    private val invite1: Invite = Invite(inviteId1)
    private val invite2: Invite = Invite(inviteId1)

    private val applicant1 = Applicant(id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = mutableListOf(invite1, invite2), createdAt = OffsetDateTime.now())
    private val applicant2 = Applicant(id = 2L, name = "Jane Doe", email = "jane@example.com", preferredLanguage = null, invites = mutableListOf(), createdAt = OffsetDateTime.now().plusDays(1))

    private val applicant1ReadDTO = ApplicantReadDTO(
        id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = listOf(inviteId1, inviteId2), createdAt =
            applicant1.createdAt
    )
    private val applicant2ReadDTO = ApplicantReadDTO(
        id = 1L, name = "Jane Doe", email = "jane@example.com", preferredLanguage = null, invites = listOf(), createdAt =
            applicant2.createdAt
    )

    @Test
    fun `test applicant 1 is returned`() {
        // given
        every { applicantReadService.getById(1) } returns applicant1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/applicant/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(applicant1.name))
    }

    @Test
    fun `test paginated applicants list is returned with null example`() {
        // given
        every { applicantReadService.getPaginatedEntity(any<Applicant>(), any<Pageable>()) } returns PaginatedDTO(2, listOf(applicant1ReadDTO, applicant2ReadDTO))
        every { applicantReadService.getPaginatedExample(any<Example<Applicant>>(), any<Pageable>()) } returns PaginatedDTO(2, listOf(applicant1ReadDTO, applicant2ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(2))
            .andExpect(jsonPath("$.data.size()").value(2))
            .andExpect(jsonPath("$.data[0].name").value(applicant1.name))
            .andExpect(jsonPath("$.data[1].name").value(applicant2.name))
    }

    @Test
    fun `test paginated applicants list is returned with name example`() {
        // given
        every { applicantReadService.getPaginatedEntity(any<Applicant>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))
        every { applicantReadService.getPaginatedExample(any<Example<Applicant>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
                .param("name", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(applicant1.name))
    }

    @Test
    fun `test paginated applicants list is returned with email example`() {
        // given
        every { applicantReadService.getPaginatedEntity(any<Applicant>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))
        every { applicantReadService.getPaginatedExample(any<Example<Applicant>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
                .param("email", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(applicant1.name))
    }

    @Test
    fun `test paginated applicants list is returned with name and email example`() {
        // given
        every { applicantReadService.getPaginatedEntity(any<Applicant>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))
        every { applicantReadService.getPaginatedExample(any<Example<Applicant>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(applicant1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
                .param("name", "John")
                .param("email", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(applicant1.name))
    }

    @Test
    fun `test 'Added an applicant' and location is returned when applicant 2 is created`() {
        // variables
        val applicant2CreateDTO = ApplicantCreateDTO(id = 2L, name = "Jane Doe", email = "jane@example.com", preferredLanguage = "")

        // given
        every { applicantCreateService.create(applicant2CreateDTO) } returns applicant2

        // verify and assert
        mockMvc.perform(
            post("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(applicant2CreateDTO))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Added an applicant"))
            .andExpect(header().string("Location", "http://localhost/applicant/${applicant2.id}"))
    }

    @Test
    fun `test 'Updated an applicant' is returned when applicant 1 is updated`() {
        // variables
        val applicant1UpdateDTO = ApplicantUpdateDTO(id = 1L, name = null, email = "john.doe@example.com", preferredLanguage = null)
        val applicant1Updated = Applicant(id = 1L, name = "John Doe", email = "john.doe@example.com", preferredLanguage = null, invites = applicant1.invites, createdAt = applicant1.createdAt)

        // given
        every { applicantUpdateService.update(applicant1UpdateDTO) } returns applicant1Updated

        // verify and assert
        mockMvc.perform(
            put("/applicant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(applicant1UpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated an applicant"))
    }

    @Test
    fun `test '204' is returned when applicant 1 is deleted`() {
        // given
        every { applicantReadService.delete(1) } returns Unit

        // verify and assert
        mockMvc.perform(
            delete("/applicant/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `test invites are returned when invites of applicant 1 are retrieved`() {
        // variables
        val invite1ReadDto = InviteReadDTO(
            inviteId1, 1L, assessmentId = 1L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
            measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
        )
        val invite2ReadDto = InviteReadDTO(
            inviteId2, 1L, assessmentId = 2L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
            measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
        )

        // given
        every { applicantReadService.getInvitesByApplicantId(1) } returns listOf(invite1ReadDto, invite2ReadDto)

        // verify and assert
        mockMvc.perform(
            get("/applicant/1/invite")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].id").value(inviteId1.toString()))
            .andExpect(jsonPath("$[1].id").value(inviteId2.toString()))
            .andExpect(jsonPath("$[0].applicantId").value(1))
            .andExpect(jsonPath("$[1].applicantId").value(1))
    }
}