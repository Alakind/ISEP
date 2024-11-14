package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@DiscriminatorValue("OPEN")
class AssignmentOpen(
    id: Long = 0,
    description: String = "",
) : Assignment(id, description)