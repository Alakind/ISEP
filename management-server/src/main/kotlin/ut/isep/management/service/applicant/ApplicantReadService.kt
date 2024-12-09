package ut.isep.management.service.applicant

import dto.applicant.ApplicantReadDTO
import dto.invite.InviteReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.applicant.ApplicantReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter

@Transactional
@Service
class ApplicantReadService(
    repository: ApplicantRepository,
    converter: ApplicantReadConverter,
    private val inviteConverter: InviteReadConverter,
) : ReadService<Applicant, ApplicantReadDTO, Long>(repository, converter) {

    fun getInviteByApplicantId(applicantId: Long): InviteReadDTO? {
        val applicant = repository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }

        return applicant.invite?.let {
            inviteConverter.toDTO(it)
        }
    }
}

