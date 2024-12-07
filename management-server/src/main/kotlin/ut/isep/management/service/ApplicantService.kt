package ut.isep.management.service

import dto.*
import dto.applicant.ApplicantCreateDTO
import dto.applicant.ApplicantReadDTO
import dto.applicant.ApplicantUpdateDTO
import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.ApplicantRepository
import kotlin.NoSuchElementException


@Service
@Transactional
class ApplicantService(
    private val applicantRepository: ApplicantRepository,
) {

    fun createApplicant(applicantDTO: ApplicantCreateDTO): Applicant {
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
            updateDTO.email?.let { this.email = it }
            updateDTO.preferredLanguage?.let { this.preferredLanguage = it }
            updateDTO.name?.let { this.name = it }
            updateDTO.score?.let { this.score = it }
        }
        applicantRepository.save(applicant)
    }

    fun deleteApplicant(id: Long) {
        applicantRepository.deleteById(id)
    }

    fun getApplicantById(id: Long): ApplicantReadDTO {
        val applicant: Applicant = applicantRepository.findById(id).orElseThrow{
            NoSuchElementException("Applicant not found with id $id")
        }
        return applicant.toDTO()
    }



    fun getInviteByApplicantId(applicantId: Long): InviteReadDTO? {
        val applicant = applicantRepository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }

        return applicant.invite?.toDTO()
    }

    fun getAssessmentByApplicantId(applicantId: Long): AssessmentReadDTO? {
        val applicant = applicantRepository.findById(applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }
        return applicant.invite?.assessment?.toDTO()
    }


    fun getAllApplicants(limit: Int?, page: Int?, sort: String?): PaginatedDTO<ApplicantReadDTO> {
        val sortCriteria = parseSort(sort)
        val applicants = if (limit != null) {
            val pageable = PageRequest.of(page ?: 0, limit, sortCriteria)
            applicantRepository.findAll(pageable).content.map(Applicant::toDTO)
        } else {
            applicantRepository.findAll(sortCriteria).map(Applicant::toDTO)
        }
        val amount = applicantRepository.count()
        return PaginatedDTO(amount, applicants)
    }

    private fun parseSort(sort: String?): Sort {
        if (sort.isNullOrEmpty()) {
            return Sort.unsorted()
        }
        val orders = sort.split(",").map { field ->
            val entry = field.split(":")
            val attribute = entry[0]
            val direction = if (entry.size == 2) { Sort.Direction.fromString(entry[1]) } else {
                Sort.Direction.ASC
            }
            Sort.Order(direction, attribute)
        }
        return Sort.by(orders)
    }
}
