package question

import ut.isep.management.model.entity.AssignmentOpen

data class OpenQuestion(
    override val id: String?,
    override val tags: List<String>,
    override val description: String
) : Question {
    override val type: QuestionType = QuestionType.OPEN
    override fun toEntity(): AssignmentOpen {
        return AssignmentOpen(
            description = this.description
        )
    }

}

