package ut.isep.management.service

import dto.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.pgsql.*
import ut.isep.management.repository.pgsql.ApplicantRepository
import java.util.*


@Service
@Transactional
class ApplicantService(
    private val applicantRepository: ApplicantRepository
) {

    fun addApplicant(applicantDTO: ApplicantDTO) {
        addApplicant(applicantDTO.fromDTO())
    }

    fun addApplicant(applicant: Applicant) {
        checkApplicantInDB(applicant)
        applicantRepository.save(applicant)
    }

    private fun checkApplicantInDB(a: Applicant) {
        val applicant: Optional<Applicant> = applicantRepository.findById(a.id)
        if (applicant.isPresent) {
            throw Exception("Applicant Already exists")
        }
    }

    fun getApplicantById(id: Long): ApplicantDTO {
        val applicant: Optional<Applicant> = applicantRepository.findById(id)
        return applicant.orElseThrow {
            NoSuchElementException("Applicant not found with id $id")
        }.toDTO()
    }

    val allApplicants: List<ApplicantDTO>
        get() = applicantRepository.findAll().map {it.toDTO()}
}
