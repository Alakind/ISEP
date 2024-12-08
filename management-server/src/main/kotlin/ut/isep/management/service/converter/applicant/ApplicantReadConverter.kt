package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.converter.ReadConverter


@Component
class ApplicantReadConverter : ReadConverter<Applicant, ApplicantReadDTO> {
    override fun toDTO(entity: Applicant): ApplicantReadDTO {
        return ApplicantReadDTO(
            id = entity.id,
            name = entity.name,
            email = entity.email,
            status = entity.status,
            preferredLanguage = entity.preferredLanguage,
            score = entity.score,
            invite = entity.invite?.id
        )
    }
}
