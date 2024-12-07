package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantUpdateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.converter.UpdateConverter

@Component
class ApplicantUpdateConverter : UpdateConverter<Applicant, ApplicantUpdateDTO> {
    override fun updateEntity(entity: Applicant, updateDTO: ApplicantUpdateDTO): Applicant {
        return entity.apply {
            updateDTO.name?.let { this.name = it }
            updateDTO.status?.let { this.status = it }
            updateDTO.preferredLanguage?.let { this.preferredLanguage = it }
            updateDTO.score?.let { this.score = it }
        }
    }
}
