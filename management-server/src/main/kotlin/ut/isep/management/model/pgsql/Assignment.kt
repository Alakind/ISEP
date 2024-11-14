package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "assignment_type", discriminatorType = DiscriminatorType.STRING)
abstract class Assignment protected constructor(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0,
    open val description: String = "",
)