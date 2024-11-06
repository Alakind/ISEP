package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@DiscriminatorValue("OPEN")
class AssignmentOpen(
    @ElementCollection
    override val description: List<String>,
) : Assignment(description) {
    // No-arg constructor for JPA
    constructor() : this(emptyList())
}
