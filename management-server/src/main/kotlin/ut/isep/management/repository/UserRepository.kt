package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.User


@Repository
interface UserRepository : BaseRepository<User, Long>
