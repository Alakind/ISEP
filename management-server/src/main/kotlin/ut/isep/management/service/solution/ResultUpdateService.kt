package ut.isep.management.service.solution

import dto.assignment.ResultAssignmentUpdateDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.repository.SolvedAssignmentRepository
import java.util.*

@Service
class ResultUpdateService(
    private val repository: SolvedAssignmentRepository
) {

    fun updateAssignment(inviteId: UUID, updateDTO: ResultAssignmentUpdateDTO) {
        val key = SolvedAssignmentId(inviteId, updateDTO.id.toLong())
        val existingSolution = repository.findById(key).orElseThrow {
            NoSuchElementException("No existing solution for assignment ID: ${updateDTO.id}")
        }
        // Ensure we're not updating solvedAssignments that do not belong to our invite
        require(inviteId == existingSolution.invite?.id) {
            throw UnsupportedOperationException("Cannot update solvedAssignments that don't belong to your invite")
        }

        existingSolution.scoredPoints = updateDTO.scoredPoints
        repository.save(existingSolution)
    }
}