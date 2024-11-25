package ut.isep.management.repository

import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.model.entity.Invite

interface InviteRepository: JpaRepository<Invite, Long>