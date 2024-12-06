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
            Applicant(name = "Aaron", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin", email = "aaron@example.com"),
            Applicant(name = "Zebediah", status = ApplicantStatus.not_started, preferredLanguage = "F", email = "zebediah1@example.com"),
            Applicant(name = "Zebediah", status = ApplicantStatus.app_finished, preferredLanguage = "C", email = "zebediah2@example.com"),
            Applicant(name = "Henk", status = ApplicantStatus.app_reminded, preferredLanguage = "Rust", email = "henk@example.com"),
            Applicant(name = "Gerrit", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript", email = "gerrit@example.com"),
            Applicant(name = "Simon", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell", email = "simon@example.com"),
            Applicant(name = "Andre", status = ApplicantStatus.cancelled, preferredLanguage = "Java", email = "andre@example.com"),
            Applicant(name = "Laura", status = ApplicantStatus.app_invited_start, preferredLanguage = "Python", email = "laura@example.com"),
            Applicant(name = "Sophia", status = ApplicantStatus.not_started, preferredLanguage = "Swift", email = "sophia@example.com"),
            Applicant(name = "Lucas", status = ApplicantStatus.app_finished, preferredLanguage = "Kotlin", email = "lucas@example.com"),
            Applicant(name = "Isabella", status = ApplicantStatus.app_reminded, preferredLanguage = "Go", email = "isabella@example.com"),
            Applicant(name = "Mason", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript", email = "mason@example.com"),
            Applicant(name = "Olivia", status = ApplicantStatus.test_expired, preferredLanguage = "Scala", email = "olivia@example.com"),
            Applicant(name = "Elijah", status = ApplicantStatus.cancelled, preferredLanguage = "C++", email = "elijah@example.com"),
            Applicant(name = "Emma", status = ApplicantStatus.app_invited_start, preferredLanguage = "Ruby", email = "emma@example.com"),
            Applicant(name = "James", status = ApplicantStatus.not_started, preferredLanguage = "PHP", email = "james@example.com"),
            Applicant(name = "Ava", status = ApplicantStatus.app_finished, preferredLanguage = "C#", email = "ava@example.com"),
            Applicant(name = "Ethan", status = ApplicantStatus.app_reminded, preferredLanguage = "Perl", email = "ethan@example.com"),
            Applicant(name = "Mia", status = ApplicantStatus.not_started, preferredLanguage = "TypeScript", email = "mia@example.com"),
            Applicant(name = "Benjamin", status = ApplicantStatus.test_expired, preferredLanguage = "R", email = "benjamin@example.com"),
            Applicant(name = "Amelia", status = ApplicantStatus.cancelled, preferredLanguage = "Lua", email = "amelia@example.com"),
            Applicant(name = "Henry", status = ApplicantStatus.app_invited_start, preferredLanguage = "Elixir", email = "henry@example.com"),
            Applicant(name = "Evelyn", status = ApplicantStatus.not_started, preferredLanguage = "Python", email = "evelyn@example.com"),
            Applicant(name = "Alexander", status = ApplicantStatus.app_finished, preferredLanguage = "Java", email = "alexander@example.com"),
            Applicant(name = "Ella", status = ApplicantStatus.app_reminded, preferredLanguage = "Clojure", email = "ella1@example.com"),
            Applicant(name = "William", status = ApplicantStatus.not_started, preferredLanguage = "Rust", email = "william@example.com"),
            Applicant(name = "Scarlett", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell", email = "scarlett@example.com"),
            Applicant(name = "Jack", status = ApplicantStatus.cancelled, preferredLanguage = "F#", email = "jack@example.com"),
            Applicant(name = "Victoria", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript", email = "victoria@example.com"),
            Applicant(name = "Daniel", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin", email = "daniel@example.com"),
            Applicant(name = "Grace", status = ApplicantStatus.app_finished, preferredLanguage = "Swift", email = "grace@example.com"),
            Applicant(name = "Matthew", status = ApplicantStatus.app_reminded, preferredLanguage = "C", email = "matthew@example.com"),
            Applicant(name = "Aria", status = ApplicantStatus.not_started, preferredLanguage = "Go", email = "aria@example.com"),
            Applicant(name = "Joseph", status = ApplicantStatus.test_expired, preferredLanguage = "C++", email = "joseph@example.com"),
            Applicant(name = "Luna", status = ApplicantStatus.cancelled, preferredLanguage = "R", email = "luna@example.com"),
            Applicant(name = "Michael", status = ApplicantStatus.app_invited_start, preferredLanguage = "Java", email = "michael@example.com"),
            Applicant(name = "Chloe", status = ApplicantStatus.not_started, preferredLanguage = "PHP", email = "chloe@example.com"),
            Applicant(name = "David", status = ApplicantStatus.app_finished, preferredLanguage = "C#", email = "david@example.com"),
            Applicant(name = "Sofia", status = ApplicantStatus.app_reminded, preferredLanguage = "Ruby", email = "sofia@example.com"),
            Applicant(name = "Jackson", status = ApplicantStatus.not_started, preferredLanguage = "Python", email = "jackson@example.com"),
            Applicant(name = "Emily", status = ApplicantStatus.test_expired, preferredLanguage = "Elixir", email = "emily@example.com"),
            Applicant(name = "Samuel", status = ApplicantStatus.cancelled, preferredLanguage = "JavaScript", email = "samuel@example.com"),
            Applicant(name = "Ella", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin", email = "ella2@example.com"),
            Applicant(name = "Sebastian", status = ApplicantStatus.not_started, preferredLanguage = "Swift", email = "sebastian@example.com"),
            Applicant(name = "Levi", status = ApplicantStatus.app_finished, preferredLanguage = "C", email = "levi@example.com"),
            Applicant(name = "Zoey", status = ApplicantStatus.app_reminded, preferredLanguage = "Go", email = "zoey@example.com"),
            Applicant(name = "Nathan", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript", email = "nathan@example.com"),
            Applicant(name = "Hannah", status = ApplicantStatus.test_expired, preferredLanguage = "Scala", email = "hannah@example.com"),
            Applicant(name = "Caleb", status = ApplicantStatus.cancelled, preferredLanguage = "C++", email = "caleb@example.com"),
            Applicant(name = "Aubrey", status = ApplicantStatus.app_invited_start, preferredLanguage = "Rust", email = "aubrey@example.com"),
            Applicant(name = "Isaac", status = ApplicantStatus.not_started, preferredLanguage = "Perl", email = "isaac@example.com"),
            Applicant(name = "Addison", status = ApplicantStatus.app_finished, preferredLanguage = "TypeScript", email = "addison@example.com"),
            Applicant(name = "Ryan", status = ApplicantStatus.app_reminded, preferredLanguage = "R", email = "ryan@example.com"),
            Applicant(name = "Layla", status = ApplicantStatus.not_started, preferredLanguage = "Lua", email = "layla@example.com"),
            Applicant(name = "Dylan", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell", email = "dylan@example.com"),
            Applicant(name = "Aiden", status = ApplicantStatus.cancelled, preferredLanguage = "F#", email = "aiden@example.com"),
            Applicant(name = "Madelyn", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript", email = "madelyn@example.com"),
            Applicant(name = "Wyatt", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin", email = "wyatt@example.com"),
            Applicant(name = "Eleanor", status = ApplicantStatus.app_finished, preferredLanguage = "Swift", email = "eleanor@example.com"),
            Applicant(name = "Luke", status = ApplicantStatus.app_reminded, preferredLanguage = "C", email = "luke@example.com"),
            Applicant(name = "Arianna", status = ApplicantStatus.not_started, preferredLanguage = "Go", email = "arianna@example.com"),
            Applicant(name = "Jayden", status = ApplicantStatus.test_expired, preferredLanguage = "C++", email = "jayden@example.com"),
            Applicant(name = "Riley", status = ApplicantStatus.cancelled, preferredLanguage = "R", email = "riley@example.com"),
            Applicant(name = "Gabriel", status = ApplicantStatus.app_invited_start, preferredLanguage = "Java", email = "gabriel@example.com"),
            Applicant(name = "Bella", status = ApplicantStatus.not_started, preferredLanguage = "PHP", email = "bella@example.com"),
            Applicant(name = "Hunter", status = ApplicantStatus.app_finished, preferredLanguage = "C#", email = "hunter@example.com"),
            Applicant(name = "Nora", status = ApplicantStatus.app_reminded, preferredLanguage = "Ruby", email = "nora@example.com"),
            Applicant(name = "Anthony", status = ApplicantStatus.not_started, preferredLanguage = "Python", email = "anthony@example.com"),
            Applicant(name = "Claire", status = ApplicantStatus.test_expired, preferredLanguage = "Elixir", email = "claire@example.com"),
            Applicant(name = "Julian", status = ApplicantStatus.cancelled, preferredLanguage = "JavaScript", email = "julian@example.com"),
            Applicant(name = "Aurora", status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin", email = "aurora@example.com"),
            Applicant(name = "Hudson", status = ApplicantStatus.not_started, preferredLanguage = "Swift", email = "hudson@example.com"),
            Applicant(name = "Savannah", status = ApplicantStatus.app_finished, preferredLanguage = "C", email = "savannah@example.com"),
            Applicant(name = "Grayson", status = ApplicantStatus.app_reminded, preferredLanguage = "Go", email = "grayson@example.com"),
            Applicant(name = "Skylar", status = ApplicantStatus.not_started, preferredLanguage = "JavaScript", email = "skylar@example.com"),
            Applicant(name = "Lincoln", status = ApplicantStatus.test_expired, preferredLanguage = "Scala", email = "lincoln@example.com"),
            Applicant(name = "Zoe", status = ApplicantStatus.cancelled, preferredLanguage = "C++", email = "zoe@example.com"),
            Applicant(name = "Ezra", status = ApplicantStatus.app_invited_start, preferredLanguage = "Rust", email = "ezra@example.com"),
            Applicant(name = "Genesis", status = ApplicantStatus.not_started, preferredLanguage = "Perl", email = "genesis@example.com"),
            Applicant(name = "Elias", status = ApplicantStatus.app_finished, preferredLanguage = "TypeScript", email = "elias@example.com"),
            Applicant(name = "Caroline", status = ApplicantStatus.app_reminded, preferredLanguage = "R", email = "caroline@example.com"),
            Applicant(name = "Maverick", status = ApplicantStatus.not_started, preferredLanguage = "Lua", email = "maverick@example.com"),
            Applicant(name = "Autumn", status = ApplicantStatus.test_expired, preferredLanguage = "Haskell", email = "autumn@example.com"),
            Applicant(name = "Christopher", status = ApplicantStatus.cancelled, preferredLanguage = "F#", email = "christopher@example.com"),
            Applicant(name = "Everly", status = ApplicantStatus.app_invited_start, preferredLanguage = "JavaScript", email = "everly@example.com"),
            Applicant(name = "Joshua", status = ApplicantStatus.not_started, preferredLanguage = "Kotlin", email = "joshua@example.com"),
            Applicant(name = "Naomi", status = ApplicantStatus.app_finished, preferredLanguage = "Swift", email = "naomi@example.com"),
            Applicant(name = "Jaxon", status = ApplicantStatus.app_reminded, preferredLanguage = "C", email = "jaxon@example.com"),
            Applicant(name = "Hazel", status = ApplicantStatus.not_started, preferredLanguage = "Go", email = "hazel@example.com")
        )


        applicants.forEach { applicantRepository.save(it) }

        val inviteApplicant1Assessment1 = Invite(applicant = applicants[0], assessment = assessment1)
        inviteRepository.save(inviteApplicant1Assessment1)

        println("Dummy data loaded!")
    }
}
