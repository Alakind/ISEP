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
            name = entity.name!!,
            email = entity.email!!,
            preferredLanguage = entity.preferredLanguage,
            invites = entity.invites.map { it.id },
            createdAt = entity.createdAt,
        )
    }
}
