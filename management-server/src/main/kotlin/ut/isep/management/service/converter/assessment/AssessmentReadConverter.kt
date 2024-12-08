package ut.isep.management.service.converter.assessment


import dto.assessment.AssessmentReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Assessment
import ut.isep.management.service.converter.ReadConverter

@Component
class AssessmentReadConverter : ReadConverter<Assessment, AssessmentReadDTO> {
    override fun toDTO(entity: Assessment): AssessmentReadDTO {
        return AssessmentReadDTO(
            id = entity.id,
            sections = entity.sections.map {it.id}
        )
    }
}