package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Assignment

@Repository
interface AssignmentRepository : BaseRepository<Assignment, Long>
