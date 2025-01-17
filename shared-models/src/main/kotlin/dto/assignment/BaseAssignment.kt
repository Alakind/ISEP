package dto.assignment

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema


abstract class BaseAssignment : ReadDTO {
    abstract val id: Long
    abstract val description: String
    abstract val type: AssignmentType
    abstract val availablePoints: Int
    abstract val availableSeconds: Long

    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice, Open }
}
