package ut.isep.management.service.solution

import dto.section.ResultSectionSimpleReadDTO
import dto.assignment.ResultAssignmentReadDTO
import dto.section.ResultSectionReadDTO
import dto.section.SectionInfo
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.solution.ResultAssignmentReadConverter
import java.util.UUID

@Transactional
@Service
class ResultReadService(
    repository: SolvedAssignmentRepository,
    converter: ResultAssignmentReadConverter,
    val inviteRepository: InviteRepository,
    val sectionRepository: SectionRepository,
    val assessmentRepository: AssessmentRepository
): ReadService<SolvedAssignment, ResultAssignmentReadDTO, SolvedAssignmentId>(repository, converter) {

    fun getResultSection(inviteId: UUID, sectionId: Long): ResultSectionReadDTO {
        if (!inviteRepository.existsById(inviteId)) {
            throw java.util.NoSuchElementException("No invite with ID: $inviteId")
        }
        val section = sectionRepository.findById(sectionId)
            .orElseThrow { NoSuchElementException("No section with ID: $sectionId") }
        val solvedAssignments = getSolvedAssignments(inviteId, section)
        return createResultDTO(solvedAssignments, section)
    }

    private fun getSolvedAssignments(inviteId: UUID, section: Section): List<SolvedAssignment> {
        // Look for solved versions of all assignments of the section
        return section.assignments.mapNotNull { assignment ->
            repository.findByIdOrNull(SolvedAssignmentId(inviteId, assignment.id))
        }
    }

    private fun createResultDTO(assignments: List<SolvedAssignment>, section: Section): ResultSectionReadDTO {
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = assignments.map { converter.toDTO(it) }
        return ResultSectionReadDTO(
            SectionInfo(
                id = section.id,
                title = section.title!!,
                availablePoints = section.availablePoints
            ),
            assignments = assignmentDTOs,
            scoredPoints = assignmentDTOs.mapNotNull {it.scoredPoints}.ifEmpty {null}?.sum()
        )
    }

    private fun createSimpleResultDTO(assignments: List<SolvedAssignment>, section: Section): ResultSectionSimpleReadDTO {
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = assignments.map { converter.toDTO(it) }
        return ResultSectionSimpleReadDTO(
            title = section.title!!,
            availablePoints = section.availablePoints,
            scoredPoints = assignmentDTOs.mapNotNull {it.scoredPoints}.ifEmpty { null }?.sum()
        )
    }

    fun getResultByAssessment(inviteId: UUID, assessmentId: Long): List<ResultSectionSimpleReadDTO> {
        if (!inviteRepository.existsById(inviteId)) {
            throw java.util.NoSuchElementException("No invite with ID: $inviteId")
        }
        val assessment = assessmentRepository.findById(assessmentId).orElseThrow { NoSuchElementException("No assessment with ID: $assessmentId") }
        return assessment.sections.map {section ->
            val solvedAssignments = getSolvedAssignments(inviteId, section)
            createSimpleResultDTO(solvedAssignments, section)
        }
    }
}
