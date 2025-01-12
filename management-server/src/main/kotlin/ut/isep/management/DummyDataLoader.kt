package ut.isep.management

import enumerable.InviteStatus
import enumerable.UserRole
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.repository.*
import kotlin.time.Duration.Companion.minutes

@Component
class DummyDataLoader(
    private val applicantRepository: ApplicantRepository,
    private val assessmentRepository: AssessmentRepository,
    private val inviteRepository: InviteRepository,
    private val sectionRepository: SectionRepository,
    private val assignmentRepository: AssignmentRepository,
    private val solvedAssignmentRepository: SolvedAssignmentRepository,
    private val userRepository: UserRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // clear database in the correct order to avoid foreign key constraint violations
        solvedAssignmentRepository.deleteAll()
        inviteRepository.deleteAll()        // This will cascade to delete SolvedAssignments
        applicantRepository.deleteAll()     // Delete applicants
        assessmentRepository.deleteAll()    // Delete assessments
        sectionRepository.deleteAll()       // Delete sections
        assignmentRepository.deleteAll()    // Delete assignments
        userRepository.deleteAll()
        // dummy Assignments
        val assignment1 = AssignmentMultipleChoice(
            description = "What will I get if I will sum 2 and 2?",
            optionToSolution = mapOf("42" to false, "Isaac Newton" to true, "Madagascar" to false),
            availablePoints = 10,
            availableSeconds = 120
        )

        val assignment2 = AssignmentMultipleChoice(
            description = "Which member(s) should receive a red card?",
            optionToSolution = mapOf("Aleks" to true, "Jarno" to true, "Jesse" to true, "Ruben" to true, "Everard" to false),
            availablePoints = 3,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val assignment3 = AssignmentMultipleChoice(
            description = "You are a 15th century plague doctor, please cure this sick person",
            optionToSolution = mapOf("Mouse bites" to true, "Leeches" to false, "More mouse bites" to true, "All of the above" to true),
            availablePoints = 34,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val assignment4 = AssignmentMultipleChoice(
            description = "How Long is a Chinese person",
            optionToSolution = mapOf("Option A" to false, "169.7 cm (5 ft 7 in)" to false, "Trick question" to true),
            availablePoints = 3,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val openAssignment1 = AssignmentOpen(
            description = "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
            referenceAnswer = "words words words",
            availablePoints = 9,
            availableSeconds = 8.minutes.inWholeSeconds
        )

        val openAssignment2 = AssignmentOpen(
            description = "Prove whether or not P = NP in 150 words",
            referenceAnswer = "Let P = NP, then PN = P.",
            availablePoints = 5,
            availableSeconds = 15.minutes.inWholeSeconds
        )

        val assignment5 = AssignmentMultipleChoice(
            description = "What will I get if I will sum 2 and 2?",
            optionToSolution = mapOf("42" to false, "Isaac Newton" to true, "Madagascar" to false),
            availablePoints = 10,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val assignment6 = AssignmentMultipleChoice(
            description = "Which member(s) should receive a red card?",
            optionToSolution = mapOf("Aleks" to true, "Jarno" to true, "Jesse" to true, "Ruben" to true, "Everard" to false),
            availablePoints = 10,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val assignment7 = AssignmentMultipleChoice(
            description = "You are a 15th century plague doctor, please cure this sick person",
            optionToSolution = mapOf("Mouse bites" to true, "Leeches" to false, "More mouse bites" to true, "All of the above" to true),
            availablePoints = 2,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val assignment8 = AssignmentMultipleChoice(
            description = "How Long is a Chinese person",
            optionToSolution = mapOf("Option A" to false, "169.7 cm (5 ft 7 in)" to false, "Trick question" to true),
            availablePoints = 3,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val openAssignment3 = AssignmentOpen(
            description = "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
            referenceAnswer = "words words words",
            availablePoints = 2,
            availableSeconds = 10.minutes.inWholeSeconds
        )

        val openAssignment4 = AssignmentOpen(
            description = "Prove whether or not P = NP in 150 words",
            referenceAnswer = "Let P = NP, then PN = P.",
            availablePoints = 59,
            availableSeconds = 2.minutes.inWholeSeconds
        )

        val section1 = Section(
            title = "Demo Section 1",
            assignments = listOf(assignment1, assignment2, openAssignment1),
        )

        val section2 = Section(
            title = "Demo Section 2",
            assignments = listOf(assignment3, assignment4, openAssignment2)
        )

        val section3 = Section(
            title = "Demo Section 1",
            assignments = listOf(assignment5, assignment6, openAssignment3)
        )

        val section4 = Section(
            title = "Demo Section 2",
            assignments = listOf(assignment7, assignment8, openAssignment4)
        )

        val assessment1 = Assessment(tag = "JAVA assessment", sections = mutableListOf(section1, section2))
        section1.assessment = assessment1
        section2.assessment = assessment1

        val assessment2 = Assessment(tag = "SQL assessment", sections = mutableListOf(section3, section4))
        section3.assessment = assessment2
        section4.assessment = assessment2

        assessmentRepository.save(assessment1)
        assessmentRepository.save(assessment2)
        sectionRepository.save(section1)
        sectionRepository.save(section2)
        sectionRepository.save(section3)
        sectionRepository.save(section4)

        val user1 = User(name = "Default admin", email = "fallbackAdmin@infosupport.nl", role = UserRole.Admin)
        val user2 = User(name = "Abbc", email = "abbc@gmail.com")
        val user3 = User(name = "SuperUser", email = "su@sudo.com", role = UserRole.Admin)
        val user4 = User(name = "Inge Interviewer", email = "inge@infosupport.nl", role = UserRole.Interviewer)
        val user5 = User(name = "Zacharias", email = "z@hotmail.com", role = UserRole.Recruiter)
        val user6 = User(name = "Jurre", email = "jurre@infosupport.nl", role = UserRole.Admin)

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
            Applicant(name = "Zebediah", preferredLanguage = "C", email = "zebediah2@example.com"),
            Applicant(name = "Henk", preferredLanguage = "Rust", email = "henk@example.com"),
            Applicant(name = "Gerrit", preferredLanguage = "JavaScript", email = "gerrit@example.com"),
            Applicant(name = "Simon", preferredLanguage = "Haskell", email = "simon@example.com"),
            Applicant(name = "Andre", preferredLanguage = "Java", email = "andre@example.com"),
            Applicant(name = "Laura", preferredLanguage = "Python", email = "laura@example.com"),
            Applicant(name = "Sophia", preferredLanguage = "Swift", email = "sophia@example.com"),
            Applicant(name = "Lucas", preferredLanguage = "Kotlin", email = "lucas@example.com"),
            Applicant(name = "Isabella", preferredLanguage = "Go", email = "isabella@example.com"),
            Applicant(name = "Mason", preferredLanguage = "JavaScript", email = "mason@example.com"),
            Applicant(name = "Olivia", preferredLanguage = "Scala", email = "olivia@example.com"),
            Applicant(name = "Elijah", preferredLanguage = "C++", email = "elijah@example.com"),
            Applicant(name = "Emma", preferredLanguage = "Ruby", email = "emma@example.com"),
            Applicant(name = "James", preferredLanguage = "PHP", email = "james@example.com"),
            Applicant(name = "Ava", preferredLanguage = "C#", email = "ava@example.com"),
            Applicant(name = "Ethan", preferredLanguage = "Perl", email = "ethan@example.com"),
            Applicant(name = "Mia", preferredLanguage = "TypeScript", email = "mia@example.com"),
            Applicant(name = "Benjamin", preferredLanguage = "R", email = "benjamin@example.com"),
            Applicant(name = "Amelia", preferredLanguage = "Lua", email = "amelia@example.com"),
            Applicant(name = "Henry", preferredLanguage = "Elixir", email = "henry@example.com"),
            Applicant(name = "Evelyn", preferredLanguage = "Python", email = "evelyn@example.com"),
            Applicant(name = "Alexander", preferredLanguage = "Java", email = "alexander@example.com"),
            Applicant(name = "Ella", preferredLanguage = "Clojure", email = "ella1@example.com"),
            Applicant(name = "William", preferredLanguage = "Rust", email = "william@example.com"),
            Applicant(name = "Scarlett", preferredLanguage = "Haskell", email = "scarlett@example.com"),
            Applicant(name = "Jack", preferredLanguage = "F#", email = "jack@example.com"),
            Applicant(name = "Victoria", preferredLanguage = "JavaScript", email = "victoria@example.com"),
            Applicant(name = "Daniel", preferredLanguage = "Kotlin", email = "daniel@example.com"),
            Applicant(name = "Grace", preferredLanguage = "Swift", email = "grace@example.com"),
            Applicant(name = "Matthew", preferredLanguage = "C", email = "matthew@example.com"),
            Applicant(name = "Aria", preferredLanguage = "Go", email = "aria@example.com"),
            Applicant(name = "Joseph", preferredLanguage = "C++", email = "joseph@example.com"),
            Applicant(name = "Luna", preferredLanguage = "R", email = "luna@example.com"),
            Applicant(name = "Michael", preferredLanguage = "Java", email = "michael@example.com"),
            Applicant(name = "Chloe", preferredLanguage = "PHP", email = "chloe@example.com"),
            Applicant(name = "David", preferredLanguage = "C#", email = "david@example.com"),
            Applicant(name = "Sofia", preferredLanguage = "Ruby", email = "sofia@example.com"),
            Applicant(name = "Jackson", preferredLanguage = "Python", email = "jackson@example.com"),
            Applicant(name = "Emily", preferredLanguage = "Elixir", email = "emily@example.com"),
            Applicant(name = "Samuel", preferredLanguage = "JavaScript", email = "samuel@example.com"),
            Applicant(name = "Ella", preferredLanguage = "Kotlin", email = "ella2@example.com"),
            Applicant(name = "Sebastian", preferredLanguage = "Swift", email = "sebastian@example.com"),
            Applicant(name = "Levi", preferredLanguage = "C", email = "levi@example.com"),
            Applicant(name = "Zoey", preferredLanguage = "Go", email = "zoey@example.com"),
            Applicant(name = "Nathan", preferredLanguage = "JavaScript", email = "nathan@example.com"),
            Applicant(name = "Hannah", preferredLanguage = "Scala", email = "hannah@example.com"),
            Applicant(name = "Caleb", preferredLanguage = "C++", email = "caleb@example.com"),
            Applicant(name = "Aubrey", preferredLanguage = "Rust", email = "aubrey@example.com"),
            Applicant(name = "Isaac", preferredLanguage = "Perl", email = "isaac@example.com"),
            Applicant(name = "Addison", preferredLanguage = "TypeScript", email = "addison@example.com"),
            Applicant(name = "Ryan", preferredLanguage = "R", email = "ryan@example.com"),
            Applicant(name = "Layla", preferredLanguage = "Lua", email = "layla@example.com"),
            Applicant(name = "Dylan", preferredLanguage = "Haskell", email = "dylan@example.com"),
            Applicant(name = "Aiden", preferredLanguage = "F#", email = "aiden@example.com"),
            Applicant(name = "Madelyn", preferredLanguage = "JavaScript", email = "madelyn@example.com"),
            Applicant(name = "Wyatt", preferredLanguage = "Kotlin", email = "wyatt@example.com"),
            Applicant(name = "Eleanor", preferredLanguage = "Swift", email = "eleanor@example.com"),
            Applicant(name = "Luke", preferredLanguage = "C", email = "luke@example.com"),
            Applicant(name = "Arianna", preferredLanguage = "Go", email = "arianna@example.com"),
            Applicant(name = "Jayden", preferredLanguage = "C++", email = "jayden@example.com"),
            Applicant(name = "Riley", preferredLanguage = "R", email = "riley@example.com"),
            Applicant(name = "Gabriel", preferredLanguage = "Java", email = "gabriel@example.com"),
            Applicant(name = "Bella", preferredLanguage = "PHP", email = "bella@example.com"),
            Applicant(name = "Hunter", preferredLanguage = "C#", email = "hunter@example.com"),
            Applicant(name = "Nora", preferredLanguage = "Ruby", email = "nora@example.com"),
            Applicant(name = "Anthony", preferredLanguage = "Python", email = "anthony@example.com"),
            Applicant(name = "Claire", preferredLanguage = "Elixir", email = "claire@example.com"),
            Applicant(name = "Julian", preferredLanguage = "JavaScript", email = "julian@example.com"),
            Applicant(name = "Aurora", preferredLanguage = "Kotlin", email = "aurora@example.com"),
            Applicant(name = "Hudson", preferredLanguage = "Swift", email = "hudson@example.com"),
            Applicant(name = "Savannah", preferredLanguage = "C", email = "savannah@example.com"),
            Applicant(name = "Grayson", preferredLanguage = "Go", email = "grayson@example.com"),
            Applicant(name = "Skylar", preferredLanguage = "JavaScript", email = "skylar@example.com"),
            Applicant(name = "Lincoln", preferredLanguage = "Scala", email = "lincoln@example.com"),
            Applicant(name = "Zoe", preferredLanguage = "C++", email = "zoe@example.com"),
            Applicant(name = "Ezra", preferredLanguage = "Rust", email = "ezra@example.com"),
            Applicant(name = "Genesis", preferredLanguage = "Perl", email = "genesis@example.com"),
            Applicant(name = "Elias", preferredLanguage = "TypeScript", email = "elias@example.com"),
            Applicant(name = "Caroline", preferredLanguage = "R", email = "caroline@example.com"),
            Applicant(name = "Maverick", preferredLanguage = "Lua", email = "maverick@example.com"),
            Applicant(name = "Autumn", preferredLanguage = "Haskell", email = "autumn@example.com"),
            Applicant(name = "Christopher", preferredLanguage = "F#", email = "christopher@example.com"),
            Applicant(name = "Everly", preferredLanguage = "JavaScript", email = "everly@example.com"),
            Applicant(name = "Joshua", preferredLanguage = "Kotlin", email = "joshua@example.com"),
            Applicant(name = "Naomi", preferredLanguage = "Swift", email = "naomi@example.com"),
            Applicant(name = "Jaxon", preferredLanguage = "C", email = "jaxon@example.com"),
            Applicant(name = "Hazel", preferredLanguage = "Go", email = "hazel@example.com")
        )


        applicants.forEach { applicantRepository.save(it) }

        val inviteApplicant0Assessment1 = Invite.createInvite(applicant = applicants[0], assessment = assessment1)
        inviteApplicant0Assessment1.status = InviteStatus.not_started
        val inviteApplicant0Assessment2 = Invite.createInvite(applicant = applicants[0], assessment = assessment2)
        inviteApplicant0Assessment2.status = InviteStatus.app_finished
        val inviteApplicant1Assessment1 = Invite.createInvite(applicant = applicants[1], assessment = assessment1)
        inviteApplicant1Assessment1.status = InviteStatus.app_finished

        inviteRepository.save(inviteApplicant0Assessment1)
        inviteRepository.save(inviteApplicant0Assessment2)
        inviteRepository.save(inviteApplicant1Assessment1)
        println("Dummy data loaded!")
    }
}
