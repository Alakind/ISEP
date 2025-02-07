package ut.isep.management.service

import jakarta.persistence.*
import ut.isep.management.model.entity.BaseEntity
import java.util.*

@Entity
@Table(name = "test_entity")
data class TestEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    override val id: UUID = UUID.randomUUID(),
    val name: String = "",
    val status: String = "",
    val type: String = "",
) : BaseEntity<UUID> {
    constructor() : this(UUID.randomUUID(), "")
}