package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A coding assignment")
data class AssignmentCodingDTO(
    // Unhide id property, it is set to hidden in superclass Assignment
    @get:Schema(hidden = false)
    override val id: Int,
    val text: List<String>,
    val language: String,
    val files: Map<String, ByteArray>,
) : AssignmentDTO() {
    // Unhide type property, it is set to hidden in superclass Assignment
    @get:Schema(hidden = false)
    override val type: AssignmentType = AssignmentType.Coding
}