//package ut.isep.management.controller
//
//import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
//import com.ninjasquad.springmockk.MockkBean
//import dto.applicant.ApplicantReadDTO
//import dto.invite.InviteReadDTO
//import enumerable.InviteStatus
//import io.mockk.every
//import jakarta.persistence.EntityManagerFactory
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
//import org.springframework.http.MediaType
//import org.springframework.test.web.servlet.MockMvc
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
//import ut.isep.management.model.entity.Applicant
//import ut.isep.management.model.entity.Invite
//import ut.isep.management.service.applicant.ApplicantCreateService
//import ut.isep.management.service.applicant.ApplicantReadService
//import ut.isep.management.service.applicant.ApplicantUpdateService
//import ut.isep.management.service.assessment.AssessmentReadService
//import java.time.OffsetDateTime
//import java.util.*
//
//@WebMvcTest(controllers = [ApplicantController::class])
//class ApplicantControllerUnitTest(@Autowired val mockMvc: MockMvc) {
//
//    @MockkBean
//    lateinit var applicantReadService: ApplicantReadService
//
//    @MockkBean
//    lateinit var applicantUpdateService: ApplicantUpdateService
//
//    @MockkBean
//    lateinit var applicantCreateService: ApplicantCreateService
//
//    @MockkBean
//    lateinit var assessmentReadService: AssessmentReadService
//
//    @MockkBean
//    lateinit var assignmentController: AssignmentController
//
//    @MockkBean
//    lateinit var emailController: EmailController
//
//    @MockkBean
//    lateinit var inviteController: InviteController
//
//    @MockkBean
//    lateinit var resultController: ResultController
//
//    @MockkBean
//    lateinit var sectionController: SectionController
//
//    @MockkBean
//    lateinit var solutionController: SolutionController
//
//    @MockkBean
//    lateinit var testResultController: TestResultController
//
//    @MockkBean
//    lateinit var timingController: TimingController
//
//    @MockkBean
//    lateinit var userController: UserController
//
//    @MockkBean
//    lateinit var jpaSharedEM_EMF: EntityManagerFactory
//
//    val mapper = jacksonObjectMapper()
//
//    private val inviteId1: UUID = UUID.randomUUID()
//    private val inviteId2: UUID = UUID.randomUUID()
//    private val invite1: Invite = Invite(inviteId1)
//    private val invite2: Invite = Invite(inviteId1)
//    private val invite1ReadDto = InviteReadDTO(
//        inviteId1, 1L, assessmentId = 1L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
//        measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
//    )
//    private val invite2ReadDto = InviteReadDTO(
//        inviteId2, 1L, assessmentId = 2L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
//        measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
//    )
//    private val applicantReadDTO = ApplicantReadDTO(
//        id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = listOf(inviteId1, inviteId2), createdAt =
//            OffsetDateTime.now()
//    )
//    private val applicant = Applicant(id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = mutableListOf(invite1, invite2), createdAt = OffsetDateTime.now())
//
//    @Test
//    fun test() {
//        every { applicantReadService.getById(1) } returns applicantReadDTO;
//
//        mockMvc.perform(get("/applicant"))
//            .andExpect(status().isOk)
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//            .andExpect(jsonPath("$.name").value(applicant.name))
//    }
//}