package ut.isep.management.service.solution

import dto.solution.AnswerCreateReadDTO
import dto.solution.SolutionsUpdateDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.SolvedAssignmentRepository
import java.util.*

@Service
class SolutionUpdateService(
    private val repository: SolvedAssignmentRepository,
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
        val assignment = solution.assignment as AssignmentMultipleChoice
        if (assignment.optionToSolution.values.count { it } == 1 && answerDto.answer.size > 1) {
            throw IllegalArgumentException("Cannot store multiple answers for single-answer multiple-choice question ${assignment.id}")
        }
        solution.userOptionsMarkedCorrect = answerDto.answer
        repository.save(solution)
    }

    private fun updateCodingSolution(solution: SolvedAssignmentCoding, answerDto: AnswerCreateReadDTO.Coding) {
        solution.userCode = answerDto.answer
        repository.save(solution)

    }

    private fun updateOpenSolution(solution: SolvedAssignmentOpen, answerDto: AnswerCreateReadDTO.Open) {
        solution.userSolution = answerDto.answer
        repository.save(solution)
    }
}
