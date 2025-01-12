package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import dto.section.ResultSectionSimpleReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import ut.isep.management.service.converter.section.SectionReadConverter
import ut.isep.management.service.solution.ResultReadService
import java.util.*

@Transactional
@Service
class InviteReadService(
    repository: InviteRepository,
    converter: InviteReadConverter,
    private val assessmentReadConverter: AssessmentReadConverter,
    private val sectionReadConverter: SectionReadConverter,
    private val solvedAssignmentRepository: SolvedAssignmentRepository,
    private val assessmentRepository: AssessmentRepository,
    private val resultReadService: ResultReadService,
) : ReadService<Invite, InviteReadDTO, UUID>(repository, converter) {

    fun getAssessmentByInviteId(id: UUID): AssessmentReadDTO {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found") }
        return assessmentReadConverter.toDTO(invite.assessment!!)
    }

    fun getSectionsByInviteId(inviteId: UUID): List<ResultSectionSimpleReadDTO> {
        val invite = repository.findById(inviteId)
            .orElseThrow { NoSuchElementException("Invite not found") }
        val assessment = assessmentReadConverter.toDTO(invite.assessment!!)
        return resultReadService.getResultByAssessment(inviteId, assessment.id)
    }
}
