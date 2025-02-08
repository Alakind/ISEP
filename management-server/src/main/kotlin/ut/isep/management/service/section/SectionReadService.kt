package ut.isep.management.service.section

import dto.assignment.ReferenceAssignmentReadDTO
import dto.section.SectionReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import ut.isep.management.model.entity.Section
import ut.isep.management.repository.SectionRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter
import ut.isep.management.service.converter.section.SectionReadConverter
import ut.isep.management.util.logger


@Service
@Transactional
class SectionReadService(
    val repository: SectionRepository,
    val fetchService: AsyncAssignmentFetchService,
    val sectionReadConverter: SectionReadConverter,
    val assignmentReadConverter: ReferenceAssignmentReadConverter,
) {
    val log = logger()

    fun getAll(): List<SectionReadDTO> {
        val sections = repository.findAll()

        // Map to store already fetched/computed assignment DTOs
        val idToAssignmentDTO = mutableMapOf<Long, Mono<ReferenceAssignmentReadDTO>>()

        // List to store all Mono fetch operations
        val fetchMonos = sections.flatMap { section ->
            section.assignments.map { assignment ->
                idToAssignmentDTO.getOrPut(assignment.id) {
                    fetchService.fetchAssignment(assignment, section.assessment!!.gitCommitHash!!)
                        .map { fetchedQuestion ->
                            assignmentReadConverter.toDTO(fetchedQuestion)
                        }
                        .onErrorResume { error ->
                            log.error("Error fetching assignment ${assignment.id}: ${error.message}")
                            throw error
                        }
                }
            }
        }

        // Combine all fetch operations using Mono.zip
        val assignmentResults = Mono.zip(fetchMonos) { results ->
            results.map { it as ReferenceAssignmentReadDTO }
        }.block() ?: throw NoSuchElementException("Not all assignments for all sections were successfully returned")

        // Create a map of assignment IDs to their DTOs
        val assignmentMap = assignmentResults.associateBy { it.id }

        // Associate DTOs with sections
        return sections.map { section ->
            val assignments = section.assignments.map {
                assignmentMap[it.id] ?: throw IllegalStateException("Could not find assignment with ID ${it.id}")
            }
            sectionReadConverter.toDTO(section, assignments)
        }
    }

    fun getById(id: Long): SectionReadDTO {
        val section = repository.findById(id).orElseThrow { NoSuchElementException("Entity not found") }

        val assignmentFlux: Flux<ReferenceAssignmentReadDTO> = Flux.fromIterable(section.assignments)
            .flatMap { assignment ->
                fetchService.fetchAssignment(assignment, section.assessment!!.gitCommitHash!!)
                    .map { fetchedQuestion -> assignmentReadConverter.toDTO(fetchedQuestion) }
            }

        // Combine all fetch operations using Mono.zip and handle potential null values
        val assignmentDTOs =
            assignmentFlux.collectList().block() ?: throw IllegalStateException("Failed to fetch assignments")

        return sectionReadConverter.toDTO(section, assignmentDTOs)
    }

    fun getAllIds(): List<Long> {
        return repository.findAll().map(Section::id)
    }
}