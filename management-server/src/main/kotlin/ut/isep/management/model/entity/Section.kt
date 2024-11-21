package ut.isep.management.model.entity

import jakarta.persistence.*

@Entity
open class Section(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0,
    open val title: String = "",

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    open var assessment: Assessment? = null,

    @ManyToMany(cascade = [CascadeType.ALL])
    @JoinTable(
        name = "section_assignments",
        joinColumns = [JoinColumn(name = "section_id")],
        inverseJoinColumns = [JoinColumn(name = "assignment_id")]
    )
    open val assignments: List<Assignment> = emptyList()
)
