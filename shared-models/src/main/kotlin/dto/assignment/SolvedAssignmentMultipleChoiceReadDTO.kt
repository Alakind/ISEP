package dto.assignment

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solved multiple-choice assignment")
data class SolvedAssignmentMultipleChoiceReadDTO(
    override val id: Long,
    override val description: String,
    val options: List<String>,
    val isMultipleAnswers: Boolean,
    override val answer: AnswerCreateReadDTO.MultipleChoice,
) : SolvedAssignmentReadDTO {
    override val type: BaseAssignment.AssignmentType = BaseAssignment.AssignmentType.MultipleChoice
}
