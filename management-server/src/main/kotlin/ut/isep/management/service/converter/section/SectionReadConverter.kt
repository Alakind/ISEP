package ut.isep.management.service.converter.section


import dto.assignment.ReferenceAssignmentReadDTO
import dto.section.SectionInfo
import dto.section.SectionReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Section

@Component
class SectionReadConverter {
    fun toDTO(entity: Section, assignments: List<ReferenceAssignmentReadDTO>): SectionReadDTO {
        return SectionReadDTO(
            SectionInfo(
                id = entity.id,
                title = entity.title!!,
                availablePoints = entity.availablePoints,
                availableSeconds = entity.availableSeconds,
            ),
            assignments = assignments
        )
    }
}
