package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema
import java.net.URI

@Schema(description = "Coding assignment")
data class AssignmentCodingDTO(
    override val id: Long?,
    override val type: AssignmentType = AssignmentType.Coding,
    override val description: String,
    val codeUri: URI,
    val language: String
) : AssignmentDTO()