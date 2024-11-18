package ut.isep.interview.model

class AnswerOpen(
    questionId: Long,
    var answer: String
): Answer(questionId)