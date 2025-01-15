package ut.isep.management.service.timing

import dto.timing.TimingPerSectionInSecondsUpdateDTO
import dto.timing.TimingPerSectionSwitchUpdateDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.exception.TooManyRegisteredTimedObjectsException
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.model.entity.TimingPerSectionId
import ut.isep.management.repository.TimingPerSectionRepository
import java.time.Duration
import java.time.OffsetDateTime
import java.util.*

@Transactional
@Service
class TimingPerSectionUpdateService(
    private val repository: TimingPerSectionRepository
) {

    fun updateTiming(inviteId: UUID, updateDTO: TimingPerSectionInSecondsUpdateDTO) {
        val measuredTimeSection = getMeasuredTimeEntity(inviteId, updateDTO.id)

        measuredTimeSection.seconds = updateDTO.seconds!!
        repository.save(measuredTimeSection)
    }

    fun updateTiming(inviteId: UUID, updateDTO: TimingPerSectionSwitchUpdateDTO) {
        val currentTime = OffsetDateTime.now()
        val measuredTimeSectionPrevious = setMeasuredSecondsPreviousSection(inviteId, currentTime)

        val measuredTimeSectionNext = getMeasuredTimeEntity(inviteId, updateDTO.id)
        measuredTimeSectionNext.visitedAt = currentTime

        repository.saveAll(listOf(measuredTimeSectionPrevious, measuredTimeSectionNext))
    }

    fun setMeasuredSecondsPreviousSection(inviteId: UUID, currentTime: OffsetDateTime?): TimingPerSection {
        val measuredTimeSectionsPrevious = repository.findByInviteIdAndVisitedAtNotNull(inviteId)

        if (measuredTimeSectionsPrevious.size > 1) {
            throw TooManyRegisteredTimedObjectsException("${measuredTimeSectionsPrevious.size} section have a timestamp")
        }

        check(measuredTimeSectionsPrevious.isNotEmpty()) { "No section with a timestamp found." }

        val measuredTimeSectionPrevious = measuredTimeSectionsPrevious[0]


        val duration = Duration.between(measuredTimeSectionPrevious.visitedAt, currentTime)
        measuredTimeSectionPrevious.seconds += duration.seconds
        measuredTimeSectionPrevious.visitedAt = null
        return measuredTimeSectionPrevious
    }

    private fun getMeasuredTimeEntity(inviteId: UUID, sectionId: Long): TimingPerSection {
        val key = TimingPerSectionId(inviteId, sectionId)
        val measuredTimeSection = repository.findById(key).orElseThrow {
            NoSuchElementException("No existing measured time for section ID: $sectionId")
        }

        // Ensure we're not updating measuredTimeSections that do not belong to our invite
        require(inviteId == measuredTimeSection.invite?.id) {
            throw UnsupportedOperationException("Cannot update measuredTimeSection that don't belong to your invite")
        }

        return measuredTimeSection
    }
}