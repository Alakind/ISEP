package ut.isep.management.service.solution

import dto.solution.AnswerCreateReadDTO
import dto.solution.SolutionsUpdateDTO
import org.springframework.stereotype.Service
import parser.question.MultipleChoiceQuestion
import ut.isep.management.model.entity.*
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.assignment.AssignmentFetchService
import java.util.*

@Service
class SolutionUpdateService(
    private val repository: SolvedAssignmentRepository,
    private val fetchService: AssignmentFetchService,
) {

    fun updateSolutions(inviteId: UUID, createDTO: SolutionsUpdateDTO) {
        createDTO.entries.forEach { (assignmentId, answerDTO) ->
            val key = SolvedAssignmentId(inviteId, assignmentId.toLong())
            val existingSolution = repository.findById(key).orElseThrow {
                NoSuchElementException("No existing solution for assignment ID: $assignmentId")
            }
            // Ensure we're not updating solvedAssignments that do not belong to our invite
            require(inviteId == existingSolution.invite?.id) {
                throw UnsupportedOperationException("Cannot update solvedAssignments that don't belong to your invite")
            }
            updateSolution(existingSolution, answerDTO)
        }
    }

    private fun updateSolution(existingSolution: SolvedAssignment, answerDTO: AnswerCreateReadDTO) {
        when (existingSolution) {
            is SolvedAssignmentMultipleChoice -> updateMCSolution(existingSolution, answerDTO as AnswerCreateReadDTO.MultipleChoice)
            is SolvedAssignmentCoding -> updateCodingSolution(existingSolution, answerDTO as AnswerCreateReadDTO.Coding)
            is SolvedAssignmentOpen -> updateOpenSolution(existingSolution, answerDTO as AnswerCreateReadDTO.Open)
            else -> throw UnsupportedOperationException("Unsupported assignment type: ${existingSolution::class}")
        }
    }

    private fun updateMCSolution(solution: SolvedAssignmentMultipleChoice, answerDto: AnswerCreateReadDTO.MultipleChoice) {
        val fetchedQuestion = fetchService.fetchAssignment(solution.assignment!!, solution.invite!!.assessment!!.gitCommitHash!!) as MultipleChoiceQuestion
        require(!(fetchedQuestion.options.count { it.isCorrect } == 1 && answerDto.answer.size > 1)) {
            throw IllegalArgumentException("Cannot store multiple answers for single-answer multiple-choice question ${solution.assignment!!.id}")
        }
        require(answerDto.answer.all { it in fetchedQuestion.options.map { it.text } }) {
            throw IllegalArgumentException("Provided an answer which is not possible")
        }
        solution.userOptionsMarkedCorrect = answerDto.answer
        repository.save(solution)
    }

    private fun updateCodingSolution(solution: SolvedAssignmentCoding, answerDto: AnswerCreateReadDTO.Coding) {
        solution.userCode = answerDto.code
        solution.testCode = answerDto.test
        repository.save(solution)

    }

    private fun updateOpenSolution(solution: SolvedAssignmentOpen, answerDto: AnswerCreateReadDTO.Open) {
        solution.userSolution = answerDto.answer
        repository.save(solution)
    }
}
