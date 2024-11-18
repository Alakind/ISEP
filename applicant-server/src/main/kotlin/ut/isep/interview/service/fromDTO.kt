package ut.isep.interview.service

import dto.*
import ut.isep.interview.model.Answer
import ut.isep.interview.model.AnswerMultipleChoice
import ut.isep.interview.model.AnswerOpen
import ut.isep.interview.model.AnswerSection

fun AnswerSectionDTO.fromDTO(): AnswerSection {
    return AnswerSection(
        sectionId = this.sectionId,
        answers = this.answers.map { it.fromDTO() }
    )
}

fun AnswerDTO.fromDTO(): Answer {
    return when (this) {
        is AnswerMultipleChoiceDTO -> this.fromDTO()
        is AnswerOpenDTO -> this.fromDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Answer::class} to DTO")
    }
}

fun AnswerMultipleChoiceDTO.fromDTO(): AnswerMultipleChoice {
    return AnswerMultipleChoice(
        questionId = this.questionId,
        answer = this.answer
    )
}
fun AnswerOpenDTO.fromDTO(): AnswerOpen {
    return AnswerOpen(
        questionId = this.questionId,
        answer = this.answer
    )
}
