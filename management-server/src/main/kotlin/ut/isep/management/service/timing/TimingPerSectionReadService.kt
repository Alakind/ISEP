package ut.isep.management.service.timing

import dto.timing.TimingPerSectionReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.model.entity.TimingPerSectionId
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.timing.TimingPerSectionReadConverter
import java.util.*

@Transactional
@Service
class TimingPerSectionReadService(
    repository: TimingPerSectionRepository,
    converter: TimingPerSectionReadConverter
) : ReadService<TimingPerSection, TimingPerSectionReadDTO, TimingPerSectionId>(repository, converter) {
    fun getByMeasuredTimeSectionId(inviteId: UUID, sectionId: Long): TimingPerSectionReadDTO {
        val key = TimingPerSectionId(inviteId, sectionId)
        val measuredTimeSection = repository.findById(key).orElseThrow { NoSuchElementException("No measured section with ID: $key") }
        return TimingPerSectionReadDTO(seconds = measuredTimeSection.seconds)
    }
}