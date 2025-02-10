package dto.testresult

import dto.UpdateDTO
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

@Schema(description = "An test result")
data class TestResultUpdateDTO(
    override val id: Long,
    val assignmentId: Long,
    val inviteId: UUID,
    val name: String?,
    val message: String?,
    val passed: Boolean?,
) : UpdateDTO<Long>