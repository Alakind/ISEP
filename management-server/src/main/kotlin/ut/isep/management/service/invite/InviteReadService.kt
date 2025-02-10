package ut.isep.management.service.invite

import dto.assessment.AssessmentReadDTO
import dto.invite.InviteReadDTO
import dto.invite.PreInfoReadDTO
import enumerable.InviteStatus
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root
import jakarta.transaction.Transactional
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toSet
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBodyOrNull
import org.springframework.web.reactive.function.client.awaitExchange
import parser.question.CodingQuestion
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import ut.isep.management.exception.AssessmentTimeExceededException
import ut.isep.management.exception.UnauthorizedException
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.BaseRepository
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import ut.isep.management.service.converter.invite.PreInfoReadConverter
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import ut.isep.management.util.logger
import java.time.Duration
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*
import kotlin.NoSuchElementException


@Transactional
@Service
class InviteReadService(
    repository: BaseRepository<Invite, UUID>,
    converter: InviteReadConverter,
    private val fetchService: AsyncAssignmentFetchService,
    @Qualifier("executorWebClient") private val webClient: WebClient,
    private val assessmentReadConverter: AssessmentReadConverter,
    private val timingPerSectionRepository: TimingPerSectionRepository,
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService,
    private val preInfoReadConverter: PreInfoReadConverter,
) : ReadService<Invite, InviteReadDTO, UUID>(repository, converter) {
    val log = logger()

    fun getAssessmentByInviteId(id: UUID): AssessmentReadDTO {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found for the assessment") }

        return assessmentReadConverter.toDTO(invite.assessment!!)
    }

    fun getPreInfoByInviteId(id: UUID): PreInfoReadDTO {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found for the preInfo") }

        return preInfoReadConverter.toDTO(invite)
    }

    fun startAssessment(id: UUID) {
        val invite = repository.findById(id)
            .orElseThrow { NoSuchElementException("Invite not found for the assessment") }

        if (invite.assessmentStartedAt != null) {
            return
        }
        val currentTime = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        invite.assessmentStartedAt = currentTime
        invite.measuredSecondsPerSection.first().visitedAt = currentTime
        invite.status = InviteStatus.app_started
        repository.save(invite)
        CoroutineScope(Dispatchers.IO).launch {
            requestContainerStartup(invite)
        }
    }

    private suspend fun getCodingLanguagesForInvite(invite: Invite): Set<String> {
        val codingAssignments = invite.assessment!!.sections
            .flatMap { section -> section.assignments.filter { it.assignmentType == AssignmentType.CODING } }
            .distinct()

        return codingAssignments
            .asFlow()  // Convert list to Flow for reactive handling
            .map { assignment ->
                fetchService.fetchAssignment(assignment, invite.assessment!!.gitCommitHash!!).awaitSingle()
            }
            .map { fetchedQuestion -> (fetchedQuestion as CodingQuestion).language.lowercase() }
            .toSet()// Collect the flow into a List
    }

    suspend fun requestContainerStartup(invite: Invite) {
        val languages = getCodingLanguagesForInvite(invite)
        log.info("Languages to start containers for: $languages")

        coroutineScope {  // Launch concurrent requests within this scope
            val requests = languages.map { language ->
                async {
                    val url = "/${invite.id}/$language/initialize"
                    log.info("Sending POST request to $url to start up container")
                    try {
                        webClient.post()
                            .uri(url)
                            .awaitExchange { clientResponse ->
                                if (!clientResponse.statusCode().is2xxSuccessful) {
                                    val errorBody = clientResponse.awaitBodyOrNull<String>()
                                    throw IllegalStateException("Request to $url failed with status: ${clientResponse.statusCode()}, body: $errorBody")
                                }
                            }
                    } catch (e: Exception) {
                        log.error("Error starting container for language $language", e)
                        throw e
                    }
                }
            }

            requests.awaitAll()  // Wait for all parallel requests to complete
            if (requests.isEmpty()) {
                log.info("No coding questions found, no containers started for invite ${invite.id}")
            }
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
    }

    fun checkTimingAssessment(id: UUID) {
        val invite = repository.findById(id).orElseThrow {
            NoSuchElementException("No invite with id $id")
        }
        val currentTime = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val assessmentStartedAt = invite.assessmentStartedAt
            ?: throw IllegalStateException("Assessment start time is not set")

        val spentTime = Duration.between(assessmentStartedAt, currentTime)
        val availableTime = invite.assessment?.availableSeconds
            ?: throw IllegalStateException("Available time for the assessment is not set")

        if (spentTime.seconds >= availableTime) {
            invite.status = InviteStatus.app_finished
            invite.assessmentFinishedAt = currentTime

            timingPerSectionRepository.save(timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(invite.id, currentTime))
            repository.save(invite)
            throw AssessmentTimeExceededException("Assessment time exceeded for invite ID: ${invite.id}")
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
