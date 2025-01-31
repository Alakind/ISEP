//package ut.isep.management
//
//import com.ninjasquad.springmockk.MockkBean
//import dto.applicant.ApplicantReadDTO
//import io.mockk.every
//import org.assertj.core.api.Assertions.assertThat
//import org.junit.jupiter.api.Assertions.assertNotNull
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.boot.test.web.client.TestRestTemplate
//import org.springframework.http.HttpStatus
//import org.springframework.transaction.annotation.Transactional
//import org.springframework.web.client.RestTemplate
//import ut.isep.management.controller.ApplicantController
//import ut.isep.management.controller.AssignmentController
//import ut.isep.management.repository.UserRepository
//import ut.isep.management.service.applicant.ApplicantReadService
//import ut.isep.management.service.assignment.AssignmentFetchService
//import ut.isep.management.service.assignment.ReferenceAssignmentReadService
//
//@SpringBootTest(
//    classes = [ManagementApplication::class],
//    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
//)
//class ManagementApplicationIntegrationTest {
//
//    @Autowired
//    lateinit var restTemplate: TestRestTemplate
//
////    @MockkBean
////    private lateinit var testResultRepository: TestResultRepository
////
////    @MockkBean
////    private lateinit var timingPerSectionRepository: TimingPerSectionRepository
//
//    @MockkBean
//    private lateinit var userRepository: UserRepository
//
////    @MockkBean
////    private lateinit var inviteRepository: InviteRepository
//
////    @MockkBean
////    lateinit var solvedAssignmentRepository: SolvedAssignmentRepository
//
//    @MockkBean
//    lateinit var applicantReadService: ApplicantReadService
//
////    @MockkBean
////    lateinit var applicantRepository: ApplicantRepository
//
//    @MockkBean
//    lateinit var applicantController: ApplicantController
//
//    @MockkBean
//    lateinit var assignmentController: AssignmentController
//
//    @MockkBean
//    lateinit var referenceAssignmentReadService: ReferenceAssignmentReadService
//
//    @MockkBean
//    lateinit var assignmentFetchService: AssignmentFetchService
//
//    @MockkBean(name = "githubRestTemplate")
//    lateinit var githubRestTemplate: RestTemplate
//
//    @BeforeEach
//    fun setup() {
//        userRepository.deleteAll()
////        every { solvedAssignmentRepository.deleteAll() } returns Unit
////        every { inviteRepository.deleteAll() } returns Unit
////        every { applicantRepository.deleteAll() } returns Unit
//        every { userRepository.deleteAll() } returns Unit
////        every { timingPerSectionRepository.deleteAll() } returns Unit
////        every { testResultRepository.deleteAll() } returns Unit
//    }
//
//    @Test
//    @Transactional
//    fun whenGetApplicantCalled_thenShouldReturnApplicantObject() {
//        val result = restTemplate.getForEntity("/applicant/1", ApplicantReadDTO::class.java);
//
//        assertNotNull(result)
//        assertThat(result?.statusCode).isEqualTo(HttpStatus.OK)
//        assertThat(result.body?.name).isEqualTo("John Doe")
//    }
//
//}