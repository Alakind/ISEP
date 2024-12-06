package ut.isep.management.service

import dto.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import java.net.URI
import kotlin.NoSuchElementException


@Service
@Transactional
class InviteService(
    private val inviteRepository: InviteRepository,
    private val applicantRepository: ApplicantRepository,
    private val assessmentRepository: AssessmentRepository
) {

    fun deleteInvite(id: Long) {
        inviteRepository.deleteById(id)
    }

    private fun getInviteById(id: Long): Invite {
        return inviteRepository.findById(id).orElseThrow{
            NoSuchElementException("Applicant not found with id $id")
        }
    }

    fun createInvite(inviteDto: InviteCreateDTO): URI {
        val applicant = applicantRepository.findById(inviteDto.applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        val assessment = assessmentRepository.findById(inviteDto.assessmentId)
            .orElseThrow { NoSuchElementException("Assessment not found") }

        val invite = Invite(applicant = applicant, assessment = assessment)
        val inviteId = inviteRepository.save(invite).id

        applicant.apply {
            this.invite = invite
            applicantRepository.save(this)
        }
        assessment.apply {
            this.invites.add(invite)
            assessmentRepository.save(this)
        }

        val inviteUrl = URI("https://localhost:8080/assessments/$inviteId")
        return inviteUrl
    }

    fun getInviteReadDtoById(id: Long): InviteReadDTO {
        return getInviteById(id).toReadDTO()
    }

    fun getAssessmentByInviteId(id: Long): InterviewDTO {
        return getInviteById(id).assessment.toDTO()
    }

    val allInvites: List<InviteReadDTO>
        get() = inviteRepository.findAll().map {it.toReadDTO()}
}
