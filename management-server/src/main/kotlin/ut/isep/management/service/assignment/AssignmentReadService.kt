package ut.isep.management.service.assignment

import dto.assignment.AssignmentReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Assignment
import ut.isep.management.repository.AssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assignment.AssignmentReadConverter


@Service
class AssignmentReadService(
    repository: AssignmentRepository,
    converter: AssignmentReadConverter,
) : ReadService<Assignment, AssignmentReadDTO, Long>(repository, converter)