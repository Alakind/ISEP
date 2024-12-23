package dto.section

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.ReadDTO
import dto.assignment.AssignmentReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Assignments")
data class SectionReadDTO(
    @field: JsonUnwrapped
    val sectionInfo: SectionInfo,
    val assignments: List<AssignmentReadDTO>,
    val size: Int = assignments.size
) : ReadDTO