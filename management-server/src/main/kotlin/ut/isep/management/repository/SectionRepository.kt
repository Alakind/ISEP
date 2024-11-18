package ut.isep.management.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.Section
import java.util.*


@Repository
interface SectionRepository : JpaRepository<Section, Long>