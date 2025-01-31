package ut.isep.management.service.converter.invite

import dto.invite.InviteUpdateInternalDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.converter.UpdateConverter

@Component
class InviteUpdateInternalConverter : UpdateConverter<Invite, InviteUpdateInternalDTO> {
    override fun updateEntity(entity: Invite, updateDTO: InviteUpdateInternalDTO): Invite {
        return entity.apply {
            updateDTO.status?.let { this.status = it }
            updateDTO.assessmentFinishedAt?.let { this.assessmentFinishedAt = it }
        }
    }
}