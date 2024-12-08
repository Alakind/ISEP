package ut.isep.management.service.applicant

import dto.applicant.ApplicantUpdateDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Applicant
import ut.isep.management.service.UpdateService
import ut.isep.management.service.converter.UpdateConverter

@Service
class ApplicantUpdateService(
    repository: JpaRepository<Applicant, Long>,
    converter: UpdateConverter<Applicant, ApplicantUpdateDTO>
) : UpdateService<Applicant, ApplicantUpdateDTO, Long>(repository, converter)