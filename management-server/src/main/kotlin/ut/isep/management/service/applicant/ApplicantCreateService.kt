package ut.isep.management.service.applicant

import dto.applicant.ApplicantCreateDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.CreateService
import ut.isep.management.service.converter.applicant.ApplicantCreateConverter

@Service
class ApplicantCreateService(
    repository: ApplicantRepository,
    converter: ApplicantCreateConverter,
) : CreateService<Applicant, ApplicantCreateDTO, Long>(repository, converter)

