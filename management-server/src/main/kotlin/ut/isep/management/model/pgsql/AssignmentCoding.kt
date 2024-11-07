package ut.isep.management.model.pgsql

import jakarta.persistence.*
import java.net.URI

@Entity
@DiscriminatorValue("CODING")
class AssignmentCoding(
    description: String = "",
    id: Long = 0,
    val codeUri: URI = URI(""),
    val language: String = "",
) : Assignment(id, description)
