package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@DiscriminatorValue("OPEN")
class AssignmentOpen(
    override val description: String,
) : Assignment(description) {
    // No-arg constructor for JPA
    constructor() : this("")
}
