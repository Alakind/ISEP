package ut.isep.management.repository.pgsql

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.Section
import java.util.*


@Repository
interface SectionRepository : JpaRepository<Section, Long> {

    fun findSectionById(id: Long): Section

    fun findSectionByAssignments(assignments: Set<Assignment>): Optional<Section>
}
