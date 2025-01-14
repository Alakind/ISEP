package ut.isep.management.repository


import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.model.entity.TimingPerSectionId
import java.util.*

@Repository
interface TimingPerSectionRepository : JpaRepository<TimingPerSection, TimingPerSectionId> {
    fun findByInviteIdAndVisitedAtNotNull(inviteId: UUID): List<TimingPerSection>
}