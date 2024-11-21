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

        val applicant1 = Applicant(status = ApplicantStatus.app_invited_start, preferredLanguage = "Kotlin")
        applicantRepository.save(applicant1)

        val inviteApplicant1Assessment1 = Invite(applicant = applicant1, assessment = assessment1)
        inviteRepository.save(inviteApplicant1Assessment1)

        println("Dummy data loaded!")
    }
}
