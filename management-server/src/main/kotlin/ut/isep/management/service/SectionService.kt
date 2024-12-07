package ut.isep.management.service

import dto.section.SectionReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.*
import ut.isep.management.repository.SectionRepository
import java.util.*


@Service
@Transactional
class SectionService(
    private val sectionRepository: SectionRepository
) {

    fun getSectionById(id: Long): SectionReadDTO {
        val section: Optional<Section> = sectionRepository.findById(id)
        return section.orElseThrow {
            NoSuchElementException("Section not found with id $id")
        }.toDTO()
    }

    val allSections: List<SectionReadDTO>
        get() = sectionRepository.findAll().map {it.toDTO()}

    val allSectionIDs: List<Long>
        get() = sectionRepository.findAll().map {it.id}
}
