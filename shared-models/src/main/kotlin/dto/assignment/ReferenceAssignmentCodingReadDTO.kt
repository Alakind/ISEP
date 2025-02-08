package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Coding assignment")
data class ReferenceAssignmentCodingReadDTO(
    override val id: Long,
    override val description: String,
    override val availablePoints: Int,
    override val availableSeconds: Long,
    val language: String,
    val code: String,
    val test: String,
    val secretTest: String,
    override val referenceAnswer: AnswerCreateReadDTO.Coding,
    ) : ReferenceAssignmentReadDTO() {
    override val type: AssignmentType = AssignmentType.Coding
}