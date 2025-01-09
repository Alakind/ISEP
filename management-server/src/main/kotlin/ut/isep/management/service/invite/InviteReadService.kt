package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.InviteRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import java.util.*

@Transactional
@Service
class InviteReadService(
    repository: InviteRepository,
    converter: InviteReadConverter,
    private val assessmentReadConverter: AssessmentReadConverter,
) : ReadService<Invite, InviteReadDTO, UUID>(repository, converter) {

    fun getAssessmentByInviteId(id: UUID): AssessmentReadDTO {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found") }
        return assessmentReadConverter.toDTO(invite.assessment!!)
    }
}
