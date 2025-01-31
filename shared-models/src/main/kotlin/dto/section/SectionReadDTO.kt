package dto.section

import com.fasterxml.jackson.annotation.JsonUnwrapped
import dto.ReadDTO
import dto.assignment.ReferenceAssignmentReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A Section, consisting of multiple Assignments")
data class SectionReadDTO(
    @field: JsonUnwrapped
    val sectionInfo: SectionInfo,
    val assignments: List<ReferenceAssignmentReadDTO>,
    val size: Int = assignments.size
) : ReadDTO