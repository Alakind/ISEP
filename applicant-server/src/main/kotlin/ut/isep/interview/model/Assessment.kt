package ut.isep.interview.model

import org.springframework.data.annotation.Id

class Assessment(
    @Id
    val id: Long,
    var sections: List<Section>,
    var assignments: Map<Long, Assignment>
) {
    fun sort() : Assessment {
        val multipleChoice: MutableList<Long> = mutableListOf()
        val openQuestions: MutableList<Long> = mutableListOf()

        for (section in sections) {
            for (assignmentId in section.assignments) {
                val assignment: Assignment = assignments[assignmentId] ?: throw Exception("Assignment not found")
                when (assignment) {
                    is AssignmentMultipleChoice -> multipleChoice.add(assignmentId)
                    is AssignmentOpen -> openQuestions.add(assignmentId)
                    else -> throw NotImplementedError("Cannot (yet) assign ${assignment::class} to a section")
                }
            }
        }

        val newSections: MutableList<Section> = mutableListOf()
        if (multipleChoice.isNotEmpty()) {
            newSections.add(Section(newSections.size, multipleChoice))
        }
        if (openQuestions.isNotEmpty()) {
            newSections.add(Section(newSections.size, openQuestions))
        }

        sections = newSections
        return this
    }
}