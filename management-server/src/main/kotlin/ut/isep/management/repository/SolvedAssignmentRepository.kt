package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentId

@Repository
interface SolvedAssignmentRepository : BaseRepository<SolvedAssignment, SolvedAssignmentId>