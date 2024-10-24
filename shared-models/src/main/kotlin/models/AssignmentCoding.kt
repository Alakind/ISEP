package models

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A coding assignment")
data class AssignmentCoding(
    val id: Int,
    val text: List<String>,
    val language: String,
    val files: Map<String, ByteArray>,
) : Assignment() {
    val type = AssignmentType.Coding
}