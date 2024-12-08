package ut.isep.management.service.solution

import dto.solution.SolutionsUpdateDTO
import dto.solution.SolvedAssignmentCreateReadDTO
import ut.isep.management.model.entity.*
import org.springframework.stereotype.Service
import ut.isep.management.repository.SolvedAssignmentRepository
import java.util.*
import kotlin.NoSuchElementException

@Service
class SolutionUpdateService(
    private val repository: SolvedAssignmentRepository,
) {

    fun updateSolutions(inviteId: UUID, createDTO: SolutionsUpdateDTO) {
        createDTO.entries.forEach { (assignmentId, answerDTO) ->
            val existingSolution = repository.findById(assignmentId.toLong()).orElseThrow {
                NoSuchElementException("No existing solution for assignment ID: $assignmentId")
            }
            // Ensure we're not updating solvedAssignments that do not belong to our invite
            require(inviteId == existingSolution.invite?.id) {
                throw UnsupportedOperationException("Cannot update solvedAssignments that don't belong to your invite")
            }
            updateSolution(existingSolution, answerDTO)
        }
    }

    private fun updateSolution(existingSolution: SolvedAssignment, answerDTO: SolvedAssignmentCreateReadDTO) {
        when (existingSolution) {
            is SolvedAssignmentMultipleChoice -> updateMCSolution(existingSolution, answerDTO as SolvedAssignmentCreateReadDTO.MultipleChoiceAnswer)
            is SolvedAssignmentCoding -> updateCodingSolution(existingSolution, answerDTO as SolvedAssignmentCreateReadDTO.CodingAnswer)
            is SolvedAssignmentOpen -> updateOpenSolution(existingSolution, answerDTO as SolvedAssignmentCreateReadDTO.OpenAnswer)
            else -> throw UnsupportedOperationException("Unsupported assignment type: ${existingSolution::class}")
        }
    }

    private fun updateMCSolution(solution: SolvedAssignmentMultipleChoice, answerDto: SolvedAssignmentCreateReadDTO.MultipleChoiceAnswer) {
        solution.userOptionsMarkedCorrect = answerDto.answer
         repository.save(solution)
    }

    private fun updateCodingSolution(solution: SolvedAssignmentCoding, answerDto: SolvedAssignmentCreateReadDTO.CodingAnswer) {
        solution.userCode = answerDto.answer
        repository.save(solution)

    }

    private fun updateOpenSolution(solution: SolvedAssignmentOpen, answerDto: SolvedAssignmentCreateReadDTO.OpenAnswer) {
        solution.userSolution = answerDto.answer
        repository.save(solution)
    }
}
