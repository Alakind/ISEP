package dto.assignment

import dto.CreateDTO
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

@Schema(description = "A test result")
data class TestResultCreateDTO(
    val assignmentId: Long = 0,
    val inviteId: UUID = UUID(0, 0),
    val name: String = "",
    val passed: Boolean = false,
    val message: String? = null,
) : CreateDTO