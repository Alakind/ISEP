package ut.isep.management.model.entity

import jakarta.persistence.*

@Entity
class Section(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val title: String = "",
    @ManyToMany(cascade = [CascadeType.ALL])
    @JoinTable(name = "section_assignments",
        joinColumns = [JoinColumn(name = "section_id")],
        inverseJoinColumns = [JoinColumn(name = "assignment_id")])
    val assignments: List<Assignment> = emptyList()
)