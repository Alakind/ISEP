package dto.section

import dto.ReadDTO
import dto.assignment.SolvedAssignmentReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A section with assignments including answers")
data class SolvedSectionReadDTO (
    val id: Long,
    val title: String,
    val assignments: List<SolvedAssignmentReadDTO>
) : ReadDTO