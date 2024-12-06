package ut.isep.management.service

import dto.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.AssignmentRepository
import java.util.*


@Service
@Transactional
class AssignmentService(
    private val assignmentRepository: AssignmentRepository
) {

    fun getAssignmentById(id: Long): AssignmentDTO {
        val assignment: Optional<Assignment> = assignmentRepository.findById(id)
        return assignment.orElseThrow {
            NoSuchElementException("Section not found with id $id")
        }.toDTO()
    }
}
