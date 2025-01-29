package ut.isep.management.service.converter.section


import dto.section.SectionInfo
import dto.section.SectionReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Section
import ut.isep.management.service.assignment.AssignmentFetchService
import ut.isep.management.service.converter.ReadConverter
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter

@Component
class SectionReadConverter(
    val assignmentFetchService: AssignmentFetchService,
    val assignmentReadConverter: ReferenceAssignmentReadConverter
) : ReadConverter<Section, SectionReadDTO> {
    override fun toDTO(entity: Section): SectionReadDTO {
        return SectionReadDTO(
            SectionInfo(
                id = entity.id,
                title = entity.title!!,
                availablePoints = entity.availablePoints,
                availableSeconds = entity.availableSeconds,
            ),
            assignments = entity.assignments.map { assignment ->
                val fetchedAssignment = assignmentFetchService.fetchAssignment(assignment, entity.assessment!!.gitCommitHash!!)
                assignmentReadConverter.toDTO(fetchedAssignment)
            }
        )
    }
}
