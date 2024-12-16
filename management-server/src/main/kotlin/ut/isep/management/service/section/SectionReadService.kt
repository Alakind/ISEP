package ut.isep.management.service.section

import dto.section.SectionReadDTO
import dto.section.SolvedSectionReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Section
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.section.SectionReadConverter
import ut.isep.management.service.converter.solution.SolvedAssignmentReadConverter
import java.util.*
import kotlin.NoSuchElementException


@Service
class SectionReadService(
    repository: SectionRepository,
    converter: SectionReadConverter,
    val solvedAssignmentReadConverter: SolvedAssignmentReadConverter,
    val inviteRepository: InviteRepository,
) : ReadService<Section, SectionReadDTO, Long>(repository, converter) {

    fun getSolvedSection(inviteId: UUID, sectionId: Long): SolvedSectionReadDTO {
        val section = repository.findById(sectionId).orElseThrow {NoSuchElementException("No section with ID: $sectionId")}
        val invite = inviteRepository.findById(inviteId).orElseThrow {NoSuchElementException("No invite with ID: $inviteId")}
        // O(n^2)! TODO: look into this after presentation 2
        val assignmentDTOs = invite.solutions.filter {it.assignment in section.assignments}.map {solvedAssignmentReadConverter.toDTO(it)}
        return SolvedSectionReadDTO(id = sectionId, title = section.title!!, assignments = assignmentDTOs)
    }
}