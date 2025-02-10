package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.PaginatedDTO
import dto.assessment.AssessmentReadDTO
import dto.invite.InviteCreateDTO
import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import dto.invite.PreInfoReadDTO
import enumerable.InviteStatus
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.*
import ut.isep.management.service.invite.InviteCreateService
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.invite.InviteUpdateService
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class InviteControllerUnitTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockkBean
    private lateinit var inviteReadService: InviteReadService

    @MockkBean
    private lateinit var inviteCreateService: InviteCreateService

    @MockkBean
    private lateinit var inviteUpdateService: InviteUpdateService

    private val inviteId1: UUID = UUID.randomUUID()
    private val inviteId2: UUID = UUID.randomUUID()

    private val invite1: Invite = Invite(
        id = inviteId1,
        applicant = Applicant(1L),
        assessment = Assessment(1L),
        solutions = mutableListOf(SolvedAssignmentOpen(), SolvedAssignmentCoding(), SolvedAssignmentMultipleChoice()),
        invitedAt = OffsetDateTime.now(),
        expiresAt = OffsetDateTime.now().plusWeeks(1).withHour(23).withMinute(59).withSecond(59).withNano(0),
        assessmentStartedAt = null,
        assessmentFinishedAt = null,
        measuredSecondsPerSection = mutableListOf(),
        status = InviteStatus.not_started
    )
    private val invite2: Invite = Invite(
        id = inviteId1,
        applicant = Applicant(1L),
        assessment = Assessment(2L),
        solutions = mutableListOf(SolvedAssignmentOpen()),
        invitedAt = OffsetDateTime.now().plusDays(1),
        expiresAt = OffsetDateTime.now().plusDays(1).plusWeeks(1).withHour(23).withMinute(59).withSecond(59).withNano(0),
        assessmentStartedAt = null,
        assessmentFinishedAt = null,
        measuredSecondsPerSection = mutableListOf(),
        status = InviteStatus.app_finished
    )

    val invite1ReadDto = InviteReadDTO(
        inviteId1, 1L, assessmentId = 1L, status = invite1.status, invitedAt = invite1.invitedAt, expiresAt = invite1.expiresAt, assessmentStartedAt = invite1.assessmentStartedAt,
        measuredSecondsPerSection = listOf(0), assessmentFinishedAt = invite1.assessmentFinishedAt, scoredPoints = null, availablePoints = 10
    )
    val invite2ReadDto = InviteReadDTO(
        inviteId2, 1L, assessmentId = 2L, status = invite2.status, invitedAt = invite2.invitedAt, expiresAt = invite2.expiresAt, assessmentStartedAt = invite2.assessmentStartedAt,
        measuredSecondsPerSection = listOf(0), assessmentFinishedAt = invite2.assessmentFinishedAt, scoredPoints = null, availablePoints = 10
    )

    @Test
    fun `test invite 1 is returned`() {
        // given
        every { inviteReadService.getById(inviteId1) } returns invite1ReadDto

        // verify and assert
        mockMvc.perform(
            get("/invite/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.status").value(invite1.status.toString()))
    }

    @Test
    fun `test valid request with status and date range`() {
        // variables
        val status = InviteStatus.not_started
        val startDate = LocalDate.of(2025, 1, 1)
        val endDate = LocalDate.of(2025, 1, 31)

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), any(), any(), any(), any(), any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("status", status.toString())
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString())
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with status and date range and selected betweenDateAttrributeEnum`() {
        // variables
        val status = InviteStatus.not_started
        val startDate = LocalDate.of(2025, 1, 1)
        val endDate = LocalDate.of(2025, 1, 31)

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), any(), any(), "invitedAt", any(), any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("status", status.toString())
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString())
                .param("betweenDateAttribute", "invitedAT")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with only status`() {
        // variables
        val status = InviteStatus.not_started

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), null, null, any(), listOf("status"), listOf((status))) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("status", status.toString())
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with only date range`() {
        // variables
        val startDate = LocalDate.of(2025, 1, 1)
        val endDate = LocalDate.of(2025, 1, 31)

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), startDate, endDate, any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString())
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with only end date`() {
        // variables
        val endDate = LocalDate.of(2025, 1, 31)

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), null, endDate, any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("endDate", endDate.toString())
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with only start date`() {
        // variables
        val startDate = LocalDate.of(2025, 1, 1)

        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), startDate, null, any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("startDate", startDate.toString())
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test valid request with no parameters`() {
        // given
        every { inviteReadService.getPaginatedAttributesWithDateRange(any<Pageable>(), null, null, any()) } returns PaginatedDTO(1, listOf(invite1ReadDto))

        // verify and assert
        mockMvc.perform(get("/invite"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(inviteId1.toString()))
    }

    @Test
    fun `test invalid request with startDate after endDate`() {
        // variables
        val startDate = LocalDate.of(2025, 1, 31)
        val endDate = LocalDate.of(2025, 1, 1)

        // verify and assert
        mockMvc.perform(
            get("/invite")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString())
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$").value("The given end date attribute ($endDate) lies before the given ($startDate)"))
    }

    @Test
    fun `test invite url and location is returned when invite 2 is created`() {
        // variables
        val invite2CreateDTO = InviteCreateDTO(applicantId = 1L, assessmentId = 2L, expiresAt = OffsetDateTime.of(2025, 1, 1, 1, 0, 0, 0, ZoneOffset.UTC))
        val applicant = Applicant(1L)
        val assessment = Assessment(2L)
        val invite = Invite(applicant = applicant, assessment = assessment, expiresAt = OffsetDateTime.of(2025, 1, 1, 1, 0, 0, 0, ZoneOffset.UTC))

        // given
        every { inviteCreateService.create(invite2CreateDTO) } returns invite

        // verify and assert
        mockMvc.perform(
            post("/invite")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invite2CreateDTO))
        )
            .andExpect(status().isCreated)
            .andExpect(header().string("Location", "http://localhost/invite/${invite.id}"))
    }

    @Test
    fun `test 'Updated an invite' is returned when invite 1 with app_finished status is updated`() {
        // variables
        val invite1UpdateDTO = InviteUpdateDTO(id = invite1.id, status = InviteStatus.app_finished, expiresAt = null)
        val invite1Updated = Invite(id = invite1.id)

        // given
        every { inviteUpdateService.checkStatusChange(invite1UpdateDTO) } returns Unit
        every { inviteUpdateService.update(invite1UpdateDTO) } returns invite1Updated
        every { inviteUpdateService.startAutoScoring(invite1UpdateDTO.id) } returns Unit
        every { inviteUpdateService.requestContainerCleanup(invite1UpdateDTO.id) } returns Unit

        // verify and assert
        mockMvc.perform(
            put("/invite")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invite1UpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated an invite"))
    }

    @Test
    fun `test 'Updated an invite' is returned when invite 1 with not_started status is updated`() {
        // variables
        val invite1UpdateDTO = InviteUpdateDTO(id = invite1.id, status = InviteStatus.not_started, expiresAt = null)
        val invite1Updated = Invite(id = invite1.id)

        // given
        every { inviteUpdateService.checkStatusChange(invite1UpdateDTO) } returns Unit
        every { inviteUpdateService.update(invite1UpdateDTO) } returns invite1Updated

        // verify and assert
        mockMvc.perform(
            put("/invite")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invite1UpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated an invite"))
    }

    @Test
    fun `test '204' is returned when invite 1 is deleted`() {
        // given
        every { inviteReadService.delete(inviteId1) } returns Unit

        // verify and assert
        mockMvc.perform(
            delete("/invite/$inviteId1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `test assessment is returned when invite 1 assessment is requested`() {
        // variables
        val assessmentReadDTO = AssessmentReadDTO(
            id = 1L,
            tag = "Java developer",
            commit = "sfuoir3jdmsoiuv8sjfdmclksdjdvo",
            availableSeconds = 1300,
            sections = listOf(1, 2)
        )

        // given
        every { inviteReadService.getById(inviteId1) } returns invite1ReadDto
        every { inviteReadService.startAssessment(inviteId1) } returns Unit
        every { inviteReadService.checkTimingAssessment(inviteId1) } returns Unit
        every { inviteReadService.checkAccessibilityAssessment(inviteId1) } returns Unit
        every { inviteReadService.getAssessmentByInviteId(inviteId1) } returns assessmentReadDTO

        // verify and assert
        mockMvc.perform(
            get("/invite/$inviteId1/assessment")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(assessmentReadDTO.id))
            .andExpect(jsonPath("$.tag").value(assessmentReadDTO.tag))
            .andExpect(jsonPath("$.commit").value(assessmentReadDTO.commit))
            .andExpect(jsonPath("$.availableSeconds").value(assessmentReadDTO.availableSeconds))
    }

    @Test
    fun `test pre information of the assessment is returned when invite 1 assessment is requested`() {
        // variables
        val preInfoReadDTO = PreInfoReadDTO(name = "John Doe", availableSeconds = 6000)

        // given
        every { inviteReadService.getPreInfoByInviteId(inviteId1) } returns preInfoReadDTO

        // verify and assert
        mockMvc.perform(
            get("/invite/$inviteId1/info")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(preInfoReadDTO.name))
            .andExpect(jsonPath("$.availableSeconds").value(preInfoReadDTO.availableSeconds))
    }
}