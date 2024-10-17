package models

data class AssignmentMultipleChoice(
    val id: Int,
    val text: List<String>,
    val isMultipleAnswers: Boolean,
    val options: List<String>
) : Assignment()