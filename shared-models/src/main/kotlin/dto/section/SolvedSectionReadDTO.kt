package dto.section

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.ReadDTO
import dto.assignment.SolvedAssignmentReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A section with assignments including answers")
data class SolvedSectionReadDTO (
    @field: JsonUnwrapped
    val sectionInfo: SectionInfo,
    val assignments: List<SolvedAssignmentReadDTO>,
) : ReadDTO