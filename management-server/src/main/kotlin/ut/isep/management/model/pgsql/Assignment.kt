package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "assignment_type", discriminatorType = DiscriminatorType.STRING)
abstract class Assignment(
    open val description: String
) {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0
    // No-arg constructor for JPA
    constructor() : this("")
}
