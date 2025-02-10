package ut.isep.management.service

import dto.ReadDTO
import java.util.*

data class TestReadDTO(
    val id: UUID,
    val name: String
) : ReadDTO