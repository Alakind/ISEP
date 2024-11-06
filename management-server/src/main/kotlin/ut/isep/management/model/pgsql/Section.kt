package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
class Section(
    val title: String,
    @ManyToMany
    @JoinTable(name = "section_assignments",
        joinColumns = [JoinColumn(name = "section_id")],
        inverseJoinColumns = [JoinColumn(name = "assignment_id")])
    val assignments: Set<Assignment>
) {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0
    // No-arg constructor for JPA
    constructor() : this("", emptySet())
}
