package ut.isep.management.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Assignment

@Repository
interface AssignmentRepository : JpaRepository<Assignment, Long>
