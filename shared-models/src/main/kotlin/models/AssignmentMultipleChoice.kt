package models

import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "A multiple choice assignment")
data class AssignmentMultipleChoice(
    // Unhide id property, it is set to hidden in superclass Assignment
    @get:Schema(hidden = false)
    override val id: Int,
    val text: List<String>,
    val isMultipleAnswers: Boolean,
    val options: List<String>
) : Assignment() {
    // Unhide type property, it is set to hidden in superclass Assignment
    @get:Schema(hidden = false)
    override val type = AssignmentType.MultipleChoice
}