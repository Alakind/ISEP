package ut.isep.management.service.converter.invite

import dto.invite.InviteUpdateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.converter.UpdateConverter

@Component
class InviteUpdateConverter : UpdateConverter<Invite, InviteUpdateDTO> {
    override fun updateEntity(entity: Invite, updateDTO: InviteUpdateDTO): Invite {
        return entity.apply {
            updateDTO.status?.let { this.status = it }
            updateDTO.expiresAt?.let { this.expiresAt = it.withHour(23).withMinute(59).withSecond(59).withNano(0) }
        }
    }
}