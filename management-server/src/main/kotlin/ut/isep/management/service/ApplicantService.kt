package ut.isep.management.service

import dto.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.ApplicantRepository
import kotlin.NoSuchElementException


@Service
@Transactional
class ApplicantService(
    private val applicantRepository: ApplicantRepository,
) {

    fun createApplicant(applicantDTO: ApplicantCreateReadDTO): Applicant {
        val applicantEntity = applicantDTO.fromDTO()
        checkApplicantInDB(applicantEntity)
        return applicantRepository.save(applicantEntity)
    }

    private fun checkApplicantInDB(a: Applicant) {
        applicantRepository.findById(a.id).ifPresent {
            throw Exception("Applicant already exists")
        }
    }

    fun updateApplicant(updateDTO: ApplicantUpdateDTO) {
        val applicant: Applicant = applicantRepository.findById(updateDTO.id).orElseThrow{
            NoSuchElementException("Applicant not found with id $updateDTO.id")
        }
        applicant.apply {
            updateDTO.status?.let { this.status = it }
            updateDTO.preferredLanguage?.let { this.preferredLanguage = it }
        }
        applicantRepository.save(applicant)
    }

    fun deleteApplicant(id: Long) {
        applicantRepository.deleteById(id)
    }

    fun getApplicantById(id: Long): ApplicantCreateReadDTO {
        val applicant: Applicant = applicantRepository.findById(id).orElseThrow{
            NoSuchElementException("Applicant not found with id $id")
        }
        return applicant.toDTO()
    }



    fun getInviteByApplicantId(applicantId: Long): InviteCreateDTO? {
        val applicant = applicantRepository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }

        return applicant.invite?.toDTO()
    }

    fun getInterviewByApplicantId(applicantId: Long): InterviewDTO? {
        val applicant = applicantRepository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        return applicant.invite?.assessment?.toDTO()
    }

    val allApplicants: List<ApplicantCreateReadDTO>
        get() = applicantRepository.findAll().map {it.toDTO()}
}
