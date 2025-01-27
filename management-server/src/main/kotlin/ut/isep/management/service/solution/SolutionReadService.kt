package ut.isep.management.service.solution

import dto.section.SectionInfo
import dto.section.SolvedSectionReadDTO
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Section
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.assignment.AssignmentFetchService
import ut.isep.management.service.assignment.ReferenceAssignmentReadService
import ut.isep.management.service.converter.solution.SolvedAssignmentReadConverter
import java.util.*

@Transactional
@Service
class SolutionReadService(
    val repository: SolvedAssignmentRepository,
    val converter: SolvedAssignmentReadConverter,
    val fetchService: AssignmentFetchService,
    val inviteRepository: InviteRepository,
    val sectionRepository: SectionRepository,
) {

    fun getSolvedAssignments(inviteId: UUID, section: Section): List<SolvedAssignment> {
        if (!inviteRepository.existsById(inviteId)) {
            throw NoSuchElementException("No invite with ID: $inviteId")
        }
        // Look for solved versions of all assignments of the section
        return section.assignments.mapNotNull { assignment ->
            repository.findByIdOrNull(SolvedAssignmentId(inviteId, assignment.id))
        }
    }

    fun getSolvedSection(inviteId: UUID, sectionId: Long): SolvedSectionReadDTO {
        val section = sectionRepository.findById(sectionId).orElseThrow { NoSuchElementException("No section with ID: $sectionId") }
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = getSolvedAssignments(inviteId, section).map {
            val fetchedQuestion = fetchService.fetchAssignment(it.assignment!!, it.invite!!.assessment!!.gitCommitHash!!)
            converter.toDTO(it, fetchedQuestion)
        }
        return SolvedSectionReadDTO(
            SectionInfo(
                id = sectionId,
                title = section.title!!,
                availablePoints = section.availablePoints,
                availableSeconds = section.availableSeconds,
            ),
            assignments = assignmentDTOs
        )
    }
}
