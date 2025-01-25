package ut.isep.management.service.assessment

import dto.assessment.AssessmentReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Assessment
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter

@Service
class AssessmentReadService(
    override val repository: AssessmentRepository,
    converter: AssessmentReadConverter,
) : ReadService<Assessment, AssessmentReadDTO, Long>(repository, converter) {
    fun getLatestByTag(tag: String): AssessmentReadDTO {
        val entity = repository.findByTagAndLatestTrue(tag)
            ?: throw NoSuchElementException("Entity not found")
        return converter.toDTO(entity)
    }
}