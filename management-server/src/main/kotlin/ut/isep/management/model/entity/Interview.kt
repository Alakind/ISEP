package ut.isep.management.model.entity

import jakarta.persistence.*

@Entity
class Interview(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "section_id")
    val sections: List<Section> = listOf(),
)