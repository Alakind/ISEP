package ut.isep.interview.service

import dto.AnswerDTO
import dto.AnswerSectionDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.interview.model.AnswerInterview
import ut.isep.interview.redis.AnswerRepository
import java.util.*


@Service
@Transactional
class AnswerService(
    private val answerRepository: AnswerRepository
) {

    fun initializeApplicant(applicantId: Long) {
        answerRepository.save(AnswerInterview(applicantId))
    }

    fun deleteApplicant(applicantId: Long) {
        answerRepository.deleteById(applicantId)
    }

    fun addAnswer(applicantId: Long, answer: AnswerDTO) {
        val interview: AnswerInterview = getInterviewById(applicantId)
        interview.putAnswer(answer.fromDTO())
        answerRepository.save(interview)
    }

    fun getAnswer(applicantId: Long, questionId: Long): AnswerDTO? {
        return getInterviewById(applicantId).getAnswerByQuestionId(questionId)?.toDTO()
    }

    fun addSection(applicantId: Long, section: AnswerSectionDTO) {
        for (answer: AnswerDTO in section.answers) {
            addAnswer(applicantId, answer)
        }
    }

//    fun getSection(applicantId: Long, sectionId: Long): AnswerSection? {
//        //TODO
//        return null
//    }

    fun getInterviewById(applicantId: Long): AnswerInterview {
        val answerInterview: Optional<AnswerInterview> = answerRepository.findById(applicantId)
        return answerInterview.orElseThrow {
            NoSuchElementException("Applicant not found with id $applicantId")
        }
    }
}
