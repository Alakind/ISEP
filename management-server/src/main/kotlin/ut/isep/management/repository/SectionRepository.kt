package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Section


@Repository
interface SectionRepository : BaseRepository<Section, Long>
