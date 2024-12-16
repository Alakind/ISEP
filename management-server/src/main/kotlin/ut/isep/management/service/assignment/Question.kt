package question

import ut.isep.management.model.entity.Assignment

sealed interface Question {
    val id: String? // Unique identifier for the question, can be null for new questions
    val type: QuestionType
    val tags: List<String>
    val description: String

    fun toEntity(): Assignment
}

enum class QuestionType(val type: String) {
    MULTIPLE_CHOICE("multiple-choice"),
    OPEN("open");

    companion object {
        fun fromString(type: String): QuestionType {
            return entries.find { it.type == type }
                ?: throw IllegalArgumentException("Unknown type: $type")
        }
    }
}
