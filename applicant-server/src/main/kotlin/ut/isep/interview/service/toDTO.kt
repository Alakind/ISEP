package ut.isep.interview.service

import dto.*
import ut.isep.interview.model.*

fun Answer.toDTO(): AnswerDTO {
    return when (this) {
        is AnswerMultipleChoice -> this.toDTO()
        is AnswerOpen -> this.toDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AnswerMultipleChoice.toDTO(): AnswerMultipleChoiceDTO {
    return AnswerMultipleChoiceDTO(
        type = AssignmentDTO.AssignmentType.MultipleChoice,
        assignmentId = this.assignmentId,
        answer = this.answer
    )
}

fun AnswerOpen.toDTO(): AnswerOpenDTO {
    return AnswerOpenDTO(
        type = AssignmentDTO.AssignmentType.Open,
        assignmentId = this.assignmentId,
        answer = this.answer
    )
}

fun Assessment.toDTO(): AssessmentSmallDTO {
    return AssessmentSmallDTO(
        sections = this.sections.map { it.sectionId }
    )
}

fun Assignment.toDTO(): AssignmentDTO {
    return when (this) {
        is AssignmentOpen -> this.toDTO()
        is AssignmentMultipleChoice -> this.toDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AssignmentOpen.toDTO(): AssignmentOpenDTO {
    return AssignmentOpenDTO(
        id = this.id,
        type = AssignmentDTO.AssignmentType.Open,
        description = this.description,
        answer = this.answer
    )
}

fun AssignmentMultipleChoice.toDTO(): AssignmentMultipleChoiceDTO {
    return AssignmentMultipleChoiceDTO(
        id = this.id,
        type = AssignmentDTO.AssignmentType.Open,
        description = this.description,
        answer = this.answer,
        options = this.options,
        isMultipleAnswers = this.multipleChoice
    )
}

fun Assignment.toAnswerDTO(): AnswerDTO {
    return when (this) {
        is AssignmentOpen -> this.toAnswerDTO()
        is AssignmentMultipleChoice -> this.toAnswerDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AssignmentOpen.toAnswerDTO(): AnswerOpenDTO {
    return AnswerOpenDTO(
        assignmentId = this.id,
        type = AssignmentDTO.AssignmentType.Open,
        answer = this.answer!!
    )
}

fun AssignmentMultipleChoice.toAnswerDTO(): AnswerMultipleChoiceDTO {
    return AnswerMultipleChoiceDTO(
        assignmentId = this.id,
        type = AssignmentDTO.AssignmentType.MultipleChoice,
        answer = this.answer!!
    )
}