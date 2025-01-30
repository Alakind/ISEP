package ut.isep.management

import enumerable.UserRole
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.model.entity.*
import ut.isep.management.repository.*
import ut.isep.management.util.logger

@Transactional
@Component
class DummyDataLoader(
        private val applicantRepository: ApplicantRepository,
        private val assessmentRepository: AssessmentRepository,
        private val inviteRepository: InviteRepository,
//        private val sectionRepository: SectionRepository,
//        private val assignmentRepository: AssignmentRepository,
        private val solvedAssignmentRepository: SolvedAssignmentRepository,
        private val userRepository: UserRepository,
        private val timingPerSectionRepository: TimingPerSectionRepository,
        private val testResultRepository: TestResultRepository
) : CommandLineRunner {

    private val log = logger()

    override fun run(vararg args: String?) {
        // clear database in the correct order to avoid foreign key constraint violations
        solvedAssignmentRepository.deleteAll()
        inviteRepository.deleteAll()        // This will cascade to delete SolvedAssignments
        applicantRepository.deleteAll()     // Delete applicants
//        assessmentRepository.deleteAll()    // Delete assessments
//        sectionRepository.deleteAll()       // Delete sections
//        assignmentRepository.deleteAll()    // Delete assignments
        userRepository.deleteAll()
        timingPerSectionRepository.deleteAll()
        testResultRepository.deleteAll()

        val user1 = User(name = "Default admin", oid = "jdkc39e4-3453-345g-8360-dfg24d45dg56", email = "fallbackAdmin@infosupport.nl", role = UserRole.Admin)
        val user2 = User(name = "J S", oid = "3f0dcb34-5638-4f90-8767-cdf4f0bc8b29", email = "j.e.sweers@student.utwente.nl", role = UserRole.Admin)
        val user3 = User(name = "SuperUser", oid = "sdf45df4-4574-34r5-3465-xgvrf345fg44", email = "su@sudo.com", role = UserRole.Admin)
        val user4 = User(name = "Inge Interviewer", oid = "fggsf34f-4535-dg5d-5273-dfg54bg5tg54", email = "inge@infosupport.nl", role = UserRole.Interviewer)
        val user5 = User(name = "Zacharias poef", oid = "cb5yd545-7534-3f5v-3471-xbf45xcb4c4b", email = "z@hotmail.com", role = UserRole.Recruiter)
        val user6 = User(name = "Jurre Brandsen", oid = "", email = "jurre@infosupport.nl", role = UserRole.Admin)

        userRepository.apply {
            save(user1)
            save(user2)
            save(user3)
            save(user4)
            save(user5)
            save(user6)
        }

        val applicants = listOf(
            Applicant(name = "Aaron", preferredLanguage = "Kotlin", email = "aaron@example.com"),
            Applicant(name = "Zebediah", preferredLanguage = "F", email = "zebediah1@example.com"),
            Applicant(name = "Henk", preferredLanguage = "Rust", email = "henk@example.com"),
            Applicant(name = "Gerrit", preferredLanguage = "JavaScript", email = "gerrit@example.com"),
            Applicant(name = "Simon", preferredLanguage = "Haskell", email = "simon@example.com"),
            Applicant(name = "Andre", preferredLanguage = "Java", email = "andre@example.com"),
            Applicant(name = "Laura", preferredLanguage = "Python", email = "laura@example.com"),
            Applicant(name = "Sophia", preferredLanguage = "Swift", email = "sophia@example.com"),
            Applicant(name = "Lucas", preferredLanguage = "Kotlin", email = "lucas@example.com"),
            Applicant(name = "Isabella", preferredLanguage = "Go", email = "isabella@example.com"),
            Applicant(name = "Everard", preferredLanguage = "C", email = "everarddevree@gmail.com"),
            )


        applicants.forEach { applicantRepository.save(it) }

        val assessments = assessmentRepository.findAllByLatestTrue()
        val invites: List<Invite> = assessments.mapIndexed {index, assessment ->
            Invite.createInvite(applicants[index], assessment)
        }
        inviteRepository.saveAll(invites)

        log.info("Dummy data loaded!")
    }
}
