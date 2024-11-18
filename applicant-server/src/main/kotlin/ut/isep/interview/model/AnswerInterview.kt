package ut.isep.interview.model

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("AnswerInterview")
class AnswerInterview(
    @Id
    val id: Long = -1,
    private val answers: MutableMap<Long, Answer> = mutableMapOf()
) {

    fun getAnswerByQuestionId(questionId: Long): Answer? {
        return answers[questionId]
    }

    fun putAnswer(answer: Answer) {
        answers[answer.questionId] = answer
    }
}