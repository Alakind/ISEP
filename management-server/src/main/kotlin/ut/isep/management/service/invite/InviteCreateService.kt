package ut.isep.management.service.invite

import dto.invite.InviteCreateDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository

@Service
class InviteCreateService(
    private val repository: InviteRepository,
    private val applicantRepository: ApplicantRepository,
    private val assessmentRepository: AssessmentRepository
) {

    fun create(createDto: InviteCreateDTO): Invite {
        val applicant = applicantRepository.findById(createDto.applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        val assessment = assessmentRepository.findById(createDto.assessmentId)
            .orElseThrow { NoSuchElementException("Assessment not found") }

        val invite = Invite(applicant = applicant, assessment = assessment)
        val inviteId = repository.save(invite).id

        applicant.apply {
            this.invite = invite
            applicantRepository.save(this)
        }
        assessment.apply {
            this.invites.add(invite)
            assessmentRepository.save(this)
        }

        return invite
    }
}