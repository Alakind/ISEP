package ut.isep.interview.model

class AnswerMultipleChoice(
    questionId: Long,
    var answer: List<Int>
) : Answer(questionId)