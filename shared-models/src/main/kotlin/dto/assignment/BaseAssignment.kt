package dto.assignment

import dto.ReadDTO
import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema


abstract class BaseAssignment : ReadDTO {
    abstract val id: Long
    abstract val description: String
    abstract val type: AssignmentType
    abstract val availablePoints: Int
    abstract val availableSeconds: Long
    abstract val referenceAnswer: AnswerCreateReadDTO?

    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice, Open }
}
