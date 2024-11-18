package ut.isep.interview.service

import dto.*
import ut.isep.interview.model.Answer
import ut.isep.interview.model.AnswerMultipleChoice
import ut.isep.interview.model.AnswerOpen
import ut.isep.interview.model.AnswerSection

fun AnswerSection.toDTO(): AnswerSectionDTO {
    return AnswerSectionDTO(
        id = null,
        sectionId = this.sectionId,
        answers = this.answers.map { it.toDTO() }
    )
}

fun Answer.toDTO(): AnswerDTO {
    return when (this) {
        is AnswerMultipleChoice -> this.toDTO()
        is AnswerOpen -> this.toDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AnswerMultipleChoice.toDTO(): AnswerMultipleChoiceDTO {
    return AnswerMultipleChoiceDTO(
        id = null,
        type = AssignmentDTO.AssignmentType.MultipleChoice,
        questionId = this.questionId,
        answer = this.answer
    )
}
fun AnswerOpen.toDTO(): AnswerOpenDTO {
    return AnswerOpenDTO(
        id = null,
        type = AssignmentDTO.AssignmentType.Open,
        questionId = this.questionId,
        answer = this.answer
    )
}
