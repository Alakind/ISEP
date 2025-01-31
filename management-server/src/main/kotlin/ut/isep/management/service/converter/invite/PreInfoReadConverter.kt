package ut.isep.management.service.converter.invite

import dto.invite.PreInfoReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.converter.ReadConverter

@Component
class PreInfoReadConverter : ReadConverter<Invite, PreInfoReadDTO> {
    override fun toDTO(entity: Invite): PreInfoReadDTO {
        return PreInfoReadDTO(
            name = entity.applicant!!.name ?: "",
            availableSeconds = entity.assessment!!.availableSeconds
        )
    }
}
