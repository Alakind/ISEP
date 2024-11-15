package ut.isep.management.repository.pgsql

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Assignment
import java.util.*


@Repository
interface AssignmentRepository : JpaRepository<Assignment, Long> {

    fun findAssignmentById(id: Long): Assignment

    fun findAssignmentByDescription(description: String): Optional<Assignment>
}
