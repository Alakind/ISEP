package ut.isep.management.service.assignment

import dto.assignment.AssignmentReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.repository.AssignmentRepository
import ut.isep.management.service.converter.assignment.AssignmentReadConverter


@Service
class AssignmentReadService(
    val repository: AssignmentRepository,
    val converter: AssignmentReadConverter,
) {
    fun getById(id: Long, commitHash: String): AssignmentReadDTO {
        val assignmentEntity = repository.findById(id).orElseThrow { NoSuchElementException("No assignment with ID $id")
        }
        return converter.toDTO(assignmentEntity, commitHash)
    }
}