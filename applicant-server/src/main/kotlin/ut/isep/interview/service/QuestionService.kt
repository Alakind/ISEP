package ut.isep.interview.service

import dto.AnswerDTO
import dto.AssessmentDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.interview.model.*
import ut.isep.interview.redis.QuestionRepository
import java.util.NoSuchElementException
import java.util.Optional

@Service
@Transactional
class QuestionService(
    private val questionRepository: QuestionRepository
) {

    fun setAssessment(interview: Assessment): Assessment {
        val result = interview.sort()
        questionRepository.save(result)
        return result
    }

    fun setAssessmentDTO(interview: AssessmentDTO): Assessment {
        val result = interview.fromDTO()
        println(result.sections.toString())
        return setAssessment(result)
    }

    fun deleteAssessment(applicantId: Long) {
        questionRepository.deleteById(applicantId)
    }

    fun getAssignmentsInSection(applicantId: Long, sectionId: Int): List<Assignment> {
        val assessment = getAssessment(applicantId)
        val section = assessment.sections[sectionId]
        val result: MutableList<Assignment> = mutableListOf()
        for (id: Long in section.assignments) {
            val assignment = assessment.assignments[id]?: continue
            result.add(assignment)
        }
        return result
    }

    fun getAllAnswers(applicantId: Long): List<AnswerDTO> {
        val assessment = getAssessment(applicantId)
        val result = mutableListOf<AnswerDTO>()
        for (assignment in assessment.assignments.values) {
            result.add(assignment.toAnswerDTO())
        }
        return result

    }

    fun getAssessment(applicantId: Long): Assessment {
        val questionInterview: Optional<Assessment> = questionRepository.findById(applicantId)
        return questionInterview.orElseThrow {
            NoSuchElementException("Applicant not found with id $applicantId")
        }
    }

    fun setAnswers(applicantId: Long, answers: List<AnswerDTO>) {
        val assessment = getAssessment(applicantId)
        for (answerDTO in answers) {
            val assignment = assessment.assignments[answerDTO.assignmentId]
            val answer = answerDTO.fromDTO()
            if (assignment is AssignmentOpen && answer is AnswerOpen) {
                assignment.answer = answer.answer
            } else if (assignment is AssignmentMultipleChoice && answer is AnswerMultipleChoice) {
                assignment.answer = answer.answer
            } else {
                throw IllegalArgumentException("The answer type does not correspond with the id for ${answer.assignmentId}")
            }
            setAssessment(assessment)
        }
    }

//    fun getAnswer(applicantId: Long, questionId: Long): Optional<AnswerDTO> {
//        val assignment = getAssessment(applicantId).assignments[questionId]
//        return when (assignment) {
//            is AnswerOpen -> assignment.answer
//        }
//    }
}