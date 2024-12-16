package ut.isep.interview.service

import dto.*
import ut.isep.interview.model.*

fun AnswerDTO.fromDTO(): Answer {
    return when (this) {
        is AnswerMultipleChoiceDTO -> this.fromDTO()
        is AnswerOpenDTO -> this.fromDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AnswerMultipleChoiceDTO.fromDTO(): AnswerMultipleChoice {
    return AnswerMultipleChoice(
        questionId = this.assignmentId,
        answer = this.answer
    )
}

fun AnswerOpenDTO.fromDTO(): AnswerOpen {
    return AnswerOpen(
        questionId = this.assignmentId,
        answer = this.answer
    )
}

fun AssessmentDTO.fromDTO(): Assessment {
    val assignments: MutableMap<Long, Assignment> = mutableMapOf()
    for (assignment: AssignmentDTO in this.sections.flatMap { it.assignments }) {
        assignments[assignment.id!!] = assignment.fromDTO()
    }
    return Assessment(
        sections = this.sections.map { it.fromDTO() },
        assignments = assignments,
        id = this.id
    )
}

fun SectionDTO.fromDTO(): Section {
    return Section(
        sectionId = 0,
        assignments = this.assignments.map { it.id!! }
    )
}

fun AssignmentDTO.fromDTO(): Assignment {
    return when (this) {
        is AssignmentMultipleChoiceDTO -> this.fromDTO()
        is AssignmentOpenDTO -> this.fromDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AssignmentMultipleChoiceDTO.fromDTO(): AssignmentMultipleChoice {
    return AssignmentMultipleChoice(
        id = this.id!!,
        description = this.description,
        options = this.options,
        multipleChoice = this.isMultipleAnswers,
        answer = this.answer
    )
}

fun AssignmentOpenDTO.fromDTO(): AssignmentOpen {
    return AssignmentOpen(
        id = this.id!!,
        description = this.description,
        answer = this.answer,
    )
}
