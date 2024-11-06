package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@DiscriminatorValue("MULTIPLE_CHOICE")
class AssignmentMultipleChoice(
    @ElementCollection
    override val description: List<String>,
    @ElementCollection
    val options: List<String>,
    val isMultipleAnswers: Boolean,
) : Assignment(description) {
    // No-arg constructor for JPA
    constructor() : this(emptyList(), emptyList(), false)
}
