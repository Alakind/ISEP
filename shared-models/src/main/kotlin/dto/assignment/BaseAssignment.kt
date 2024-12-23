package dto.assignment

import io.swagger.v3.oas.annotations.media.Schema
import dto.ReadDTO


abstract class BaseAssignment : ReadDTO {
    abstract val id: Long
    abstract val description: String
    abstract val type: AssignmentType
    @Schema(enumAsRef = true)
    enum class AssignmentType { Coding, MultipleChoice, Open }
}
