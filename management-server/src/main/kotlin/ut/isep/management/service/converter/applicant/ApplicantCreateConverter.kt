package ut.isep.management.service.converter.applicant

import dto.applicant.ApplicantCreateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.converter.CreateConverter

@Component
class ApplicantCreateConverter : CreateConverter<Applicant, ApplicantCreateDTO> {

    override fun fromDTO(createDTO: ApplicantCreateDTO): Applicant {
        return Applicant(
            id = 0, // Or some default
            name = createDTO.name,
            status = createDTO.status,
            preferredLanguage = createDTO.preferredLanguage,
        )
    }
}

