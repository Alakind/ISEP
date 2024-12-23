package ut.isep.management.service.section

import dto.section.SectionInfo
import dto.section.SectionReadDTO
import dto.section.SolvedSectionReadDTO
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Section
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.section.SectionReadConverter
import ut.isep.management.service.converter.solution.SolvedAssignmentReadConverter
import java.util.*
import kotlin.NoSuchElementException


@Service
class SectionReadService(
    repository: SectionRepository,
    converter: SectionReadConverter,
    val solvedAssignmentReadConverter: SolvedAssignmentReadConverter,
    val inviteRepository: InviteRepository,
    val solvedAssignmentRepository: SolvedAssignmentRepository,
) : ReadService<Section, SectionReadDTO, Long>(repository, converter) {

    fun getSolvedSection(inviteId: UUID, sectionId: Long): SolvedSectionReadDTO {
        val section = repository.findById(sectionId).orElseThrow {NoSuchElementException("No section with ID: $sectionId")}
        if (!inviteRepository.existsById(inviteId)) {
            throw NoSuchElementException("No invite with ID: $inviteId")
        }
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = section.assignments.mapNotNull { assignment ->
            solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId, assignment.id))
                ?.let { solvedAssignmentReadConverter.toDTO(it) }
        }
        return SolvedSectionReadDTO(SectionInfo(id = sectionId, title = section.title!!, availablePoints = section.availablePoints), assignments = assignmentDTOs)
    }
}