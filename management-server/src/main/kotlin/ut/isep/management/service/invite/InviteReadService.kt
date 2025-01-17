package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import enumerable.InviteStatus
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root
import jakarta.transaction.Transactional
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import ut.isep.management.exception.AssessmentTimeExceededException
import ut.isep.management.exception.UnauthorizedException
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.BaseRepository
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import java.time.Duration
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*


@Transactional
@Service
class InviteReadService(
    repository: BaseRepository<Invite, UUID>,
    converter: InviteReadConverter,
    private val assessmentReadConverter: AssessmentReadConverter,
    private val timingPerSectionRepository: TimingPerSectionRepository,
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService,
) : ReadService<Invite, InviteReadDTO, UUID>(repository, converter) {

    fun getAssessmentByInviteId(id: UUID): AssessmentReadDTO {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found") }

        return assessmentReadConverter.toDTO(invite.assessment!!)
    }

    private fun startAssessment(invite: Invite) {
        if (invite.assessmentStartedAt == null) {
            val currentTime = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
            invite.assessmentStartedAt = currentTime
            invite.measuredSecondsPerSection.first().visitedAt = currentTime
            invite.status = InviteStatus.app_started
            repository.save(invite)
        }
    }

    fun checkAccessibilityAssessment(inviteId: UUID) {
        val invite = repository.findById(inviteId)
            .orElseThrow { NoSuchElementException("Invite not found") }

        if (invite.status == InviteStatus.app_finished) {
            throw UnauthorizedException("Not authorized to retrieve assessment, invite has been finished")
        }
        if (invite.expiresAt.isBefore(OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)) || invite.status == InviteStatus.expired) {
            throw UnauthorizedException("Not authorized to retrieve assessment, invitation has been expired")
        }
        if (invite.status == InviteStatus.cancelled) {
            throw UnauthorizedException("Not authorized to retrieve assessment, invitation has been cancelled")
        }

        val currentTime = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)

        // At initial retrieval of assessment, assessment is started
        startAssessment(invite)

        val assessmentStartedAt = invite.assessmentStartedAt
            ?: throw IllegalStateException("Assessment start time is not set")

        val spentTime = Duration.between(assessmentStartedAt, currentTime)
        val availableTime = invite.assessment?.availableSeconds
            ?: throw IllegalStateException("Available time for the assessment is not set")

        if (spentTime.seconds >= availableTime) {
            invite.status = InviteStatus.app_finished
            invite.assessmentFinishedAt = currentTime

            timingPerSectionRepository.save(timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(inviteId, currentTime))
            repository.save(invite)
            throw AssessmentTimeExceededException("Assessment time exceeded for invite ID: $inviteId")
        }
    }

    fun getAllToBeFinishedInvites(): List<InviteReadDTO> {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        return repository.findAll(
            toBeFinishedQuery()
        ).filter { invite ->
            val assessmentStartedAt = invite.assessmentStartedAt
            val availableSeconds = invite.assessment?.availableSeconds ?: 0

            val calculatedEndTime = assessmentStartedAt?.plusSeconds(availableSeconds)

            calculatedEndTime?.isBefore(now) == true
        }.map { converter.toDTO(it) }
    }

    private fun toBeFinishedQuery(): Specification<Invite?> {
        return Specification { root: Root<Invite?>, _: CriteriaQuery<*>?, cb: CriteriaBuilder ->
            cb.and(
                cb.isNotNull(root.get<OffsetDateTime>("assessmentStartedAt")),
                cb.isNull(root.get<OffsetDateTime>("assessmentFinishedAt"))
            )
        }
    }
}
