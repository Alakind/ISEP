package ut.isep.management

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import ut.isep.management.model.pgsql.*
import ut.isep.management.repository.pgsql.AssignmentRepository
import ut.isep.management.repository.pgsql.SectionRepository

@Component
class DummyDataLoader(
    private val sectionRepository: SectionRepository,
    private val assignmentRepository: AssignmentRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // clear database
        sectionRepository.deleteAll()
        assignmentRepository.deleteAll()
        // dummy Assignments
        val assignment1 = AssignmentMultipleChoice(
            description = listOf("What will I get if I will sum 2 and 2?"),
            options = listOf("42", "Isaac Newton", "Madagascar"),
            isMultipleAnswers = false,
        )

        val assignment2 = AssignmentMultipleChoice(
            description = listOf("Which member(s) should receive a red card?"),
            options = listOf("Aleks", "Jarno", "Jesse", "Ruben", "Everard"),
            isMultipleAnswers = true
        )

        val assignment3 = AssignmentMultipleChoice(
            description = listOf("You are a 15th century plague doctor, please cure this sick person"),
            options = listOf("Mouse bites", "Leeches", "More mouse bites", "All of the above"),
            isMultipleAnswers = false
        )

        val assignment4 = AssignmentMultipleChoice(
            description = listOf("How Long is a Chinese person"),
            options = listOf("Option A", "169.7 cm (5 ft 7 in)", "Trick question"),
            isMultipleAnswers = false
        )

        val openAssignment1 = AssignmentOpen(
            description = listOf("Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.")
        )

        val openAssignment2 = AssignmentOpen(
            description = listOf("Prove whether or not P = NP in 150 words")
        )

        val section1 = Section(
            title = "Demo Section 1",
            assignments = setOf(assignment1, assignment2, openAssignment1)
        )

        // Create a Section with these assignments
        val section2 = Section(
            title = "Demo Section 2",
            assignments = setOf(assignment3, assignment4, openAssignment2)
        )

        sectionRepository.save(section1)
        sectionRepository.save(section2)
        println("Dummy data loaded!")
    }
}
