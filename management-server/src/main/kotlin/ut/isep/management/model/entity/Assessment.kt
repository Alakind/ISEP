package ut.isep.management.model.entity

import jakarta.persistence.*

@Entity
class Assessment(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "section_id")
    val sections: List<Section> = listOf(),

    @OneToMany(mappedBy = "assessment", cascade = [CascadeType.ALL], orphanRemoval = true)
    val invites: List<Invite> = mutableListOf()
)