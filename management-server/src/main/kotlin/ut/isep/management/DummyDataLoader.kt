package ut.isep.management

import enumerable.ApplicantStatus
import enumerable.UserRole
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.repository.*

@Component
class DummyDataLoader(
    private val applicantRepository: ApplicantRepository,
    private val assessmentRepository: AssessmentRepository,
    private val inviteRepository: InviteRepository,
    private val sectionRepository: SectionRepository,
    private val assignmentRepository: AssignmentRepository,
    private val userRepository: UserRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // clear database in the correct order to avoid foreign key constraint violations
        inviteRepository.deleteAll()        // Delete child entities first
        applicantRepository.deleteAll()     // Delete applicants if necessary
        assessmentRepository.deleteAll()    // Then delete parent entities
        sectionRepository.deleteAll()       // Finally delete the sections
        assignmentRepository.deleteAll()    // And any other related entities
        userRepository.deleteAll()
        // dummy Assignments
        val assignment1 = AssignmentMultipleChoice(
            description = "What will I get if I will sum 2 and 2?",
            options = listOf("42", "Isaac Newton", "Madagascar"),
            isMultipleAnswers = false,
        )

        val assignment2 = AssignmentMultipleChoice(
            description = "Which member(s) should receive a red card?",
            options = listOf("Aleks", "Jarno", "Jesse", "Ruben", "Everard"),
            isMultipleAnswers = true
        )

        val assignment3 = AssignmentMultipleChoice(
            description = "You are a 15th century plague doctor, please cure this sick person",
            options = listOf("Mouse bites", "Leeches", "More mouse bites", "All of the above"),
            isMultipleAnswers = false
        )

        val assignment4 = AssignmentMultipleChoice(
            description = "How Long is a Chinese person",
            options = listOf("Option A", "169.7 cm (5 ft 7 in)", "Trick question"),
            isMultipleAnswers = false
        )

        val openAssignment1 = AssignmentOpen(
            description = "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon."
        )

        val openAssignment2 = AssignmentOpen(
            description = "Prove whether or not P = NP in 150 words"
        )

        val section1 = Section(
            title = "Demo Section 1",
            assignments = listOf(assignment1, assignment2, openAssignment1)
        )

        val section2 = Section(
            title = "Demo Section 2",
            assignments = listOf(assignment3, assignment4, openAssignment2)
        )

        val assessment1 = Assessment(sections = mutableListOf(section1, section2))


        assessmentRepository.save(assessment1)

        val applicant1 = Applicant(name = "Aaron", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin")
        val applicant2 = Applicant(name = "Zebediah", status = ApplicantStatus.not_started, preferredLanguage = "F")
        val applicant3 = Applicant(name = "Zebediah", status = ApplicantStatus.app_finished, preferredLanguage = "C")
        val applicant4 = Applicant(name = "Henk", status = ApplicantStatus.app_reminded, preferredLanguage = "Rust")
        val applicant5 = Applicant(name = "Gerrit", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript")
        val applicant6 = Applicant(name = "Simon", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell")
        val applicant7 = Applicant(name = "Andre", status = ApplicantStatus.cancelled, preferredLanguage = "Java")

        applicantRepository.apply {
            save(applicant1)
            save(applicant2)
            save(applicant3)
            save(applicant4)
            save(applicant5)
            save(applicant6)
            save(applicant7)
        }

        val user1 = User(name = "Abba", email = "abba@gmail.com", role = UserRole.Recruiter)
        val user2 = User(name = "Abbc", email = "abbc@gmail.com")
        val user3 = User(name = "SuperUser", email = "su@sudo.com", role = UserRole.Admin)
        val user4 = User(name = "Inge Interviewer", email = "inge@infosupport.nl", role = UserRole.Interviewer)
        val user5 = User(name = "Zacharias", email = "z@hotmail.com", role = UserRole.Admin)

        userRepository.apply {
            save(user1)
            save(user2)
            save(user3)
            save(user4)
            save(user5)
        }
        val inviteApplicant1Assessment1 = Invite(applicant = applicant1, assessment = assessment1)
        inviteRepository.save(inviteApplicant1Assessment1)

        println("Dummy data loaded!")
    }
}
