package ut.isep.management.service

import dto.UpdateDTO
import java.util.*

data class TestUpdateDTO(
    override val id: UUID,
    val name: String
) : UpdateDTO<UUID>