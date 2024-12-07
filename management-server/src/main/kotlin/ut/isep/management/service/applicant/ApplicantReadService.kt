package ut.isep.management.service.applicant

import dto.applicant.ApplicantReadDTO
import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.applicant.ApplicantReadConverter
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter

@Service
class ApplicantReadService(
    repository: ApplicantRepository,
    converter: ApplicantReadConverter,
    private val inviteConverter: InviteReadConverter,
    private val assessmentConverter: AssessmentReadConverter
) : ReadService<Applicant, ApplicantReadDTO, Long>(repository, converter) {

    fun getInviteByApplicantId(applicantId: Long): InviteReadDTO? {
        val applicant = repository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }

        return applicant.invite?.let {
            inviteConverter.toDTO(it)
        }
    }

    fun getAssessmentByApplicantId(applicantId: Long): AssessmentReadDTO? {
        val applicant = repository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        return applicant.invite?.assessment?.let {
            assessmentConverter.toDTO(it)
        }
    }
}

