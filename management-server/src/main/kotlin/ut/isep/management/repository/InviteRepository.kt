package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Invite
import java.util.*

@Repository
interface InviteRepository : BaseRepository<Invite, UUID>