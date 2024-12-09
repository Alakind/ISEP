package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema


@Schema(description = "Solved multiple choice assignment")
data class SolvedAssignmentMultipleChoiceReadDTO(
    override val id: Long,
    override val type: AssignmentReadDTO.AssignmentType = AssignmentReadDTO.AssignmentType.MultipleChoice,
    override val description: String,
    val options: List<String>,
    val isMultipleAnswers: Boolean,
    override val answer: AnswerCreateReadDTO.MultipleChoice
) : SolvedAssignmentReadDTO()
