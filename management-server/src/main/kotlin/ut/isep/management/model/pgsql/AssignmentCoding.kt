package ut.isep.management.model.pgsql

import jakarta.persistence.*
import java.net.URI

@Entity
@DiscriminatorValue("CODING")
class AssignmentCoding(
    @ElementCollection
    override val description: List<String>,
    val codeUri: URI,
    val language: String,
) : Assignment(description) {
    // No-arg constructor for JPA
    constructor() : this(emptyList(), URI(""), "")
}
