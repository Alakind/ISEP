package ut.isep.management.service.invite

import dto.invite.InviteUpdateInternalDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.UpdateService
import ut.isep.management.service.converter.UpdateConverter
import java.util.*

@Service
class InviteUpdateInternalService(
    repository: JpaRepository<Invite, UUID>,
    converter: UpdateConverter<Invite, InviteUpdateInternalDTO>
) : UpdateService<Invite, InviteUpdateInternalDTO, UUID>(repository, converter)