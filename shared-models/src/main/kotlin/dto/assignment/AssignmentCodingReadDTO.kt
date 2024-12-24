package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema
import java.net.URI

@Schema(description = "Coding assignment")
data class AssignmentCodingReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    val codeUri: URI,
    val language: String
) : BaseAssignment(), AssignmentReadDTO {
    override val type: AssignmentType = AssignmentType.Coding
}