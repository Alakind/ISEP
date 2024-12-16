package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@DiscriminatorValue("MULTIPLE_CHOICE")
class AssignmentMultipleChoice(
    override val description: String,
    @ElementCollection
    val options: List<String>,
    val isMultipleAnswers: Boolean,
) : Assignment(description) {
    // No-arg constructor for JPA
    constructor() : this("", emptyList(), false)
}
