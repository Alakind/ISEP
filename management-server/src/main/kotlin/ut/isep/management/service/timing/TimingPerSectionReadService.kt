package ut.isep.management.service.timing

import dto.timing.TimingPerSectionReadDTO
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.model.entity.TimingPerSectionId
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.timing.TimingPerSectionReadConverter
import java.time.Duration
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

@Transactional
@Service
class TimingPerSectionReadService(
    repository: TimingPerSectionRepository,
    converter: TimingPerSectionReadConverter,
    private val inviteRepository: InviteRepository,
) : ReadService<TimingPerSection, TimingPerSectionReadDTO, TimingPerSectionId>(repository, converter) {
    fun getByMeasuredTimeSectionId(inviteId: UUID, sectionId: Long): TimingPerSectionReadDTO {
        val key = TimingPerSectionId(inviteId, sectionId)
        val measuredTimeSection = repository.findById(key).orElseThrow { NoSuchElementException("No measured section with ID: $key") }
        return TimingPerSectionReadDTO(seconds = measuredTimeSection.seconds)
    }

    fun getMeasuredTimeInvite(inviteId: UUID): TimingPerSectionReadDTO {
        val invite = inviteRepository.findById(inviteId).orElseThrow { NoSuchElementException("No invite found by provided ID") }
        val totalTime = invite.measuredSecondsPerSection.map { it.seconds }.ifEmpty { null }?.sum() ?: 0
        val timingPerSection = TimingPerSection(seconds = totalTime)

        return converter.toDTO(timingPerSection)
    }

    fun getTimeLeft(inviteId: UUID): TimingPerSectionReadDTO {
        val invite = inviteRepository.findById(inviteId).orElseThrow { NoSuchElementException("No invite found by provided ID") }

        if (invite.assessment == null || invite.assessmentStartedAt == null) {
            throw NoSuchFieldException("No assessment found by provided ID")
        }
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val assessmentStartedAt = invite.assessmentStartedAt ?: throw IllegalStateException("Assessment has not been started yet")
        val availableSeconds = invite.assessment!!.availableSeconds

        check(availableSeconds <= 0) {
            throw IllegalStateException("Invalid assessment duration for invite: $inviteId")
        }

        val calculatedEndTime = assessmentStartedAt.plusSeconds(availableSeconds)

        check(calculatedEndTime.isBefore(now)) {
            throw IllegalStateException("Assessment has been closed")
        }

        val totalTime = Duration.between(now, calculatedEndTime).seconds
        val timingPerSection = TimingPerSection(seconds = totalTime)

        return converter.toDTO(timingPerSection)
    }
}