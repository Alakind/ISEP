package ut.isep.management.model.entity

import jakarta.persistence.*

@Entity
open class Assessment(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0,
    @OneToMany(mappedBy = "assessment", cascade = [CascadeType.ALL])
    open val sections: List<Section> = listOf(),

    @OneToMany(mappedBy = "assessment", cascade = [CascadeType.ALL], orphanRemoval = true)
    open val invites: List<Invite> = listOf()
)