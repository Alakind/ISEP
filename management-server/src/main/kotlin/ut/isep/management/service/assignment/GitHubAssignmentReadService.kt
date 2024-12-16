package ut.isep.management.service.assignment

import dto.assignment.AssignmentMultipleChoiceReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.GitHubAssignmentMultipleChoice
import ut.isep.management.repository.GitHubAssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assignment.GitHubAssignmentReadConverter


@Service
class GitHubAssignmentReadService(
    repository: GitHubAssignmentRepository,
    converter: GitHubAssignmentReadConverter
):
    ReadService<GitHubAssignmentMultipleChoice, AssignmentMultipleChoiceReadDTO, Long>(repository, converter)