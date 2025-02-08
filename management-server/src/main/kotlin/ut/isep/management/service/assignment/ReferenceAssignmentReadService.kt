package ut.isep.management.service.assignment

import dto.assignment.ReferenceAssignmentReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.repository.AssignmentRepository
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter


@Service
class ReferenceAssignmentReadService(
    val repository: AssignmentRepository,
    val fetchService: AsyncAssignmentFetchService,
    val converter: ReferenceAssignmentReadConverter,
) {
    fun getById(id: Long, commitHash: String): ReferenceAssignmentReadDTO {
        val assignmentEntity = repository.findById(id).orElseThrow { NoSuchElementException("No assignment with ID $id") }
        val fetchedQuestion = fetchService.fetchAssignment(assignmentEntity, commitHash).block()
            ?: throw IllegalStateException("Failed to fetch assignment with ID $id")
        return converter.toDTO(fetchedQuestion)
    }
}