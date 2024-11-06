package ut.isep.management.model.pgsql

import jakarta.persistence.*

@Entity
class Interview(
    @OneToMany
    @JoinColumn(name = "section_id")
    val sections: List<Section> = listOf(),
) {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0
    // No-arg constructor for JPA
    constructor() : this(emptyList())
}
