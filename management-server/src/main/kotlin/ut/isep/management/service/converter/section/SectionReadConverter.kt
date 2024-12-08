package ut.isep.management.service.converter.section


import dto.section.SectionReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Section
import ut.isep.management.service.converter.ReadConverter
import ut.isep.management.service.converter.assignment.AssignmentReadConverter

@Component
class SectionReadConverter(val assignmentReadConverter: AssignmentReadConverter) : ReadConverter<Section, SectionReadDTO> {
    override fun toDTO(entity: Section): SectionReadDTO {
        return SectionReadDTO(
            id = entity.id,
            title = entity.title,
            assignments = entity.assignments.map { assignmentReadConverter.toDTO(it) }
        )
    }
}
