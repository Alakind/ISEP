package ut.isep.management.service.invite

import dto.invite.InviteCreateDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.model.entity.*
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository

@Service
class InviteCreateService(
    private val repository: InviteRepository,
    private val applicantRepository: ApplicantRepository,
    private val assessmentRepository: AssessmentRepository
) {

    @Transactional
    fun create(createDto: InviteCreateDTO): Invite {
        val applicant = applicantRepository.findById(createDto.applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        val assessment = assessmentRepository.findById(createDto.assessmentId)
            .orElseThrow { NoSuchElementException("Assessment not found") }


        // Create the Invite
        val invite = Invite.createInvite(applicant = applicant, assessment = assessment)
        val savedInvite = repository.save(invite)

        // Update the applicant with the new invite
        applicant.apply {
            this.invites.add(savedInvite)
            applicantRepository.save(this)
        }

        // Update the assessment with the new invite
        assessment.apply {
            this.invites.add(savedInvite)
            assessmentRepository.save(this)
        }
        return savedInvite
    }
}
