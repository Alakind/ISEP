package ut.isep.management.service

import dto.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.pgsql.*
import ut.isep.management.repository.pgsql.SectionRepository
import java.util.*


@Service
@Transactional
class SectionService(
    private val sectionRepository: SectionRepository
) {

    fun addSection(sectionDTO: SectionDTO) {
        addSection(sectionDTO.fromDTO())
    }

    fun addSection(section: Section) {
        checkSectionInDB(section)
        sectionRepository.save(section)
    }

    private fun checkSectionInDB(a: Section) {
        val section: Optional<Section> = sectionRepository.findById(a.id)
        if (section.isPresent) {
            throw Exception("Section Already exists")
        }
    }

    fun getSectionById(id: Long): SectionDTO {
        val section: Optional<Section> = sectionRepository.findById(id)
        return section.orElseThrow {
            NoSuchElementException("Section not found with id $id")
        }.toDTO()
    }

    val allSections: List<SectionDTO>
        get() = sectionRepository.findAll().map {it.toDTO()}

    val allSectionIDs: List<Long>
        get() = sectionRepository.findAll().map {it.id}
}
