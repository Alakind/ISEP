package ut.isep.management.service

import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.repository.AssessmentRepository

@Service
@Transactional
class AssessmentService(
    private val assessmentRepository: AssessmentRepository
) {

    val allAssessmentIDs: List<Long>
        get() = assessmentRepository.findAll().map {it.id}
}
