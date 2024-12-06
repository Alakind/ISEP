package ut.isep.management

import enumerable.ApplicantStatus
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
    private val assignmentRepository: AssignmentRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // clear database in the correct order to avoid foreign key constraint violations
        inviteRepository.deleteAll()        // Delete child entities first
        applicantRepository.deleteAll()     // Delete applicants if necessary
        assessmentRepository.deleteAll()    // Then delete parent entities
        sectionRepository.deleteAll()       // Finally delete the sections
        assignmentRepository.deleteAll()    // And any other related entities

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

//        val applicant1 = Applicant(name = "Aaron", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin")
//        val applicant2 = Applicant(name = "Zebediah", status = ApplicantStatus.not_started, preferredLanguage = "F")
//        val applicant3 = Applicant(name = "Zebediah", status = ApplicantStatus.app_finished, preferredLanguage = "C")
//        val applicant4 = Applicant(name = "Henk", status = ApplicantStatus.app_reminded, preferredLanguage = "Rust")
//        val applicant5 = Applicant(name = "Gerrit", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript")
//        val applicant6 = Applicant(name = "Simon", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell")
//        val applicant7 = Applicant(name = "Andre", status = ApplicantStatus.cancelled, preferredLanguage = "Java")
//
//        applicantRepository.apply {
//            save(applicant1)
//            save(applicant2)
//            save(applicant3)
//            save(applicant4)
//            save(applicant5)
//            save(applicant6)
//            save(applicant7)
//        }

        val applicants = listOf(
            Applicant(name = "Aaron", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin"),
            Applicant(name = "Zebediah", status = ApplicantStatus.not_started, preferredLanguage = "F"),
            Applicant(name = "Zebediah", status = ApplicantStatus.app_finished, preferredLanguage = "C"),
            Applicant(name = "Henk", status = ApplicantStatus.app_reminded, preferredLanguage = "Rust"),
            Applicant(name = "Gerrit", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript"),
            Applicant(name = "Simon", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell"),
            Applicant(name = "Andre", status = ApplicantStatus.cancelled, preferredLanguage = "Java"),
            Applicant(name = "Laura", status = ApplicantStatus.app_invited_start, preferredLanguage = "Python"),
            Applicant(name = "Sophia", status = ApplicantStatus.not_started, preferredLanguage = "Swift"),
            Applicant(name = "Lucas", status = ApplicantStatus.app_finished, preferredLanguage = "Kotlin"),
            Applicant(name = "Isabella", status = ApplicantStatus.app_reminded, preferredLanguage = "Go"),
            Applicant(name = "Mason", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript"),
            Applicant(name = "Olivia", status = ApplicantStatus.test_expired, preferredLanguage = "Scala"),
            Applicant(name = "Elijah", status = ApplicantStatus.cancelled, preferredLanguage = "C++"),
            Applicant(name = "Emma", status = ApplicantStatus.app_invited_start, preferredLanguage = "Ruby"),
            Applicant(name = "James", status = ApplicantStatus.not_started, preferredLanguage = "PHP"),
            Applicant(name = "Ava", status = ApplicantStatus.app_finished, preferredLanguage = "C#"),
            Applicant(name = "Ethan", status = ApplicantStatus.app_reminded, preferredLanguage = "Perl"),
            Applicant(name = "Mia", status = ApplicantStatus.not_started, preferredLanguage = "TypeScript"),
            Applicant(name = "Benjamin", status = ApplicantStatus.test_expired, preferredLanguage = "R"),
            Applicant(name = "Amelia", status = ApplicantStatus.cancelled, preferredLanguage = "Lua"),
            Applicant(name = "Henry", status = ApplicantStatus.app_invited_start, preferredLanguage = "Elixir"),
            Applicant(name = "Evelyn", status = ApplicantStatus.not_started, preferredLanguage = "Python"),
            Applicant(name = "Alexander", status = ApplicantStatus.app_finished, preferredLanguage = "Java"),
            Applicant(name = "Ella", status = ApplicantStatus.app_reminded, preferredLanguage = "Clojure"),
            Applicant(name = "William", status = ApplicantStatus.not_started, preferredLanguage = "Rust"),
            Applicant(name = "Scarlett", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell"),
            Applicant(name = "Jack", status = ApplicantStatus.cancelled, preferredLanguage = "F#"),
            Applicant(name = "Victoria", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript"),
            Applicant(name = "Daniel", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin"),
            Applicant(name = "Grace", status = ApplicantStatus.app_finished, preferredLanguage = "Swift"),
            Applicant(name = "Matthew", status = ApplicantStatus.app_reminded, preferredLanguage = "C"),
            Applicant(name = "Aria", status = ApplicantStatus.not_started, preferredLanguage = "Go"),
            Applicant(name = "Joseph", status = ApplicantStatus.test_expired, preferredLanguage = "C++"),
            Applicant(name = "Luna", status = ApplicantStatus.cancelled, preferredLanguage = "R"),
            Applicant(name = "Michael", status = ApplicantStatus.app_invited_start, preferredLanguage = "Java"),
            Applicant(name = "Chloe", status = ApplicantStatus.not_started, preferredLanguage = "PHP"),
            Applicant(name = "David", status = ApplicantStatus.app_finished, preferredLanguage = "C#"),
            Applicant(name = "Sofia", status = ApplicantStatus.app_reminded, preferredLanguage = "Ruby"),
            Applicant(name = "Jackson", status = ApplicantStatus.not_started, preferredLanguage = "Python"),
            Applicant(name = "Emily", status = ApplicantStatus.test_expired, preferredLanguage = "Elixir"),
            Applicant(name = "Samuel", status = ApplicantStatus.cancelled, preferredLanguage = "JavaScript"),
            Applicant(name = "Ella", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin"),
            Applicant(name = "Sebastian", status = ApplicantStatus.not_started, preferredLanguage = "Swift"),
            Applicant(name = "Levi", status = ApplicantStatus.app_finished, preferredLanguage = "C"),
            Applicant(name = "Zoey", status = ApplicantStatus.app_reminded, preferredLanguage = "Go"),
            Applicant(name = "Nathan", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript"),
            Applicant(name = "Hannah", status = ApplicantStatus.test_expired, preferredLanguage = "Scala"),
            Applicant(name = "Caleb", status = ApplicantStatus.cancelled, preferredLanguage = "C++"),
            Applicant(name = "Aubrey", status = ApplicantStatus.app_invited_start, preferredLanguage = "Rust"),
            Applicant(name = "Isaac", status = ApplicantStatus.not_started, preferredLanguage = "Perl"),
            Applicant(name = "Addison", status = ApplicantStatus.app_finished, preferredLanguage = "TypeScript"),
            Applicant(name = "Ryan", status = ApplicantStatus.app_reminded, preferredLanguage = "R"),
            Applicant(name = "Layla", status = ApplicantStatus.not_started, preferredLanguage = "Lua"),
            Applicant(name = "Dylan", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell"),
            Applicant(name = "Aiden", status = ApplicantStatus.cancelled, preferredLanguage = "F#"),
            Applicant(name = "Madelyn", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript"),
            Applicant(name = "Wyatt", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin"),
            Applicant(name = "Eleanor", status = ApplicantStatus.app_finished, preferredLanguage = "Swift"),
            Applicant(name = "Luke", status = ApplicantStatus.app_reminded, preferredLanguage = "C"),
            Applicant(name = "Arianna", status = ApplicantStatus.not_started, preferredLanguage = "Go"),
            Applicant(name = "Jayden", status = ApplicantStatus.test_expired, preferredLanguage = "C++"),
            Applicant(name = "Riley", status = ApplicantStatus.cancelled, preferredLanguage = "R"),
            Applicant(name = "Gabriel", status = ApplicantStatus.app_invited_start, preferredLanguage = "Java"),
            Applicant(name = "Bella", status = ApplicantStatus.not_started, preferredLanguage = "PHP"),
            Applicant(name = "Hunter", status = ApplicantStatus.app_finished, preferredLanguage = "C#"),
            Applicant(name = "Nora", status = ApplicantStatus.app_reminded, preferredLanguage = "Ruby"),
            Applicant(name = "Anthony", status = ApplicantStatus.not_started, preferredLanguage = "Python"),
            Applicant(name = "Claire", status = ApplicantStatus.test_expired, preferredLanguage = "Elixir"),
            Applicant(name = "Julian", status = ApplicantStatus.cancelled, preferredLanguage = "JavaScript"),
            Applicant(name = "Aurora", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin"),
            Applicant(name = "Hudson", status = ApplicantStatus.not_started, preferredLanguage = "Swift"),
            Applicant(name = "Savannah", status = ApplicantStatus.app_finished, preferredLanguage = "C"),
            Applicant(name = "Grayson", status = ApplicantStatus.app_reminded, preferredLanguage = "Go"),
            Applicant(name = "Skylar", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript"),
            Applicant(name = "Lincoln", status = ApplicantStatus.test_expired, preferredLanguage = "Scala"),
            Applicant(name = "Zoe", status = ApplicantStatus.cancelled, preferredLanguage = "C++"),
            Applicant(name = "Ezra", status = ApplicantStatus.app_invited_start, preferredLanguage = "Rust"),
            Applicant(name = "Genesis", status = ApplicantStatus.not_started, preferredLanguage = "Perl"),
            Applicant(name = "Elias", status = ApplicantStatus.app_finished, preferredLanguage = "TypeScript"),
            Applicant(name = "Caroline", status = ApplicantStatus.app_reminded, preferredLanguage = "R"),
            Applicant(name = "Maverick", status = ApplicantStatus.not_started, preferredLanguage = "Lua"),
            Applicant(name = "Autumn", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell"),
            Applicant(name = "Christopher", status = ApplicantStatus.cancelled, preferredLanguage = "F#"),
            Applicant(name = "Everly", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript"),
            Applicant(name = "Joshua", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin"),
            Applicant(name = "Naomi", status = ApplicantStatus.app_finished, preferredLanguage = "Swift"),
            Applicant(name = "Jaxon", status = ApplicantStatus.app_reminded, preferredLanguage = "C"),
            Applicant(name = "Hazel", status = ApplicantStatus.not_started, preferredLanguage = "Go")
        )

        applicants.forEach { applicantRepository.save(it) }

        val inviteApplicant1Assessment1 = Invite(applicant = applicants[0], assessment = assessment1)
        inviteRepository.save(inviteApplicant1Assessment1)

        println("Dummy data loaded!")
    }
}
