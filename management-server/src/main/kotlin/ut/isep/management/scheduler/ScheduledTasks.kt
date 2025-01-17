package ut.isep.management.scheduler

import dto.email.EmailCreateDTO
import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import dto.invite.InviteUpdateInternalDTO
import enumerable.AllowedInvitesDateAttributeNames
import enumerable.EmailType
import enumerable.InviteStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.email.MailSenderService
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.invite.InviteUpdateInternalService
import ut.isep.management.service.invite.InviteUpdateService
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import ut.isep.management.util.logger
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Component
class ScheduledTasks(
    private val inviteReadService: InviteReadService,
    private val inviteUpdateService: InviteUpdateService,
    private val inviteUpdateInternalService: InviteUpdateInternalService,
    private val mailSenderService: MailSenderService,
    private val timingPerSectionRepository: TimingPerSectionRepository,
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService,
) {

    private val log = logger()

    @Scheduled(cron = "0 * * * * *") // Cron expression for running every minute
    fun expirationCheck() {
        val checkList = listOf(InviteStatus.not_started, InviteStatus.app_reminded_once, InviteStatus.app_reminded_twice)
        checkList.forEach {
            log.info("Started to check invites with the status $it for expiration")
            executeSetExpired(getExpirationInvites(it))
        }
    }

    private fun executeSetExpired(invites: List<InviteReadDTO>) {
        invites.forEach {
            inviteUpdateService.update(InviteUpdateDTO(id = it.id, status = InviteStatus.expired, expiresAt = it.expiresAt))
            log.info("The invite with id ${it.id} is now expired")
        }
    }

    private fun getExpirationInvites(status: InviteStatus): List<InviteReadDTO> {
        val today = LocalDate.now()
        return inviteReadService.getPaginatedAttributesWithDateRange(
            null, null, today, AllowedInvitesDateAttributeNames.expiresAt.toString(), listOf("status"), listOf(status)
        ).data
    }

    @Scheduled(cron = "0 * * * * *") // Cron expression for running every minute
    fun sendReminders() {
        val checkList = listOf(InviteStatus.not_started, InviteStatus.app_reminded_once)
        val fiveDaysPrior = LocalDate.now().plusDays(5)
        val fourDaysPrior = LocalDate.now().plusDays(4)
        val twoDaysPrior = LocalDate.now().plusDays(2)
        val oneDayPrior = LocalDate.now().plusDays(1)
        checkList.forEach {
            log.info("Started to send reminder mails to invites with the status $it")
            var startDate = fourDaysPrior
            var endDate = fiveDaysPrior
            if (it == InviteStatus.app_reminded_once) {
                startDate = oneDayPrior
                endDate = twoDaysPrior
            }
            executeSendReminder(getReminderInvites(startDate, endDate, it))
        }
    }

    private fun executeSendReminder(invites: List<InviteReadDTO>) {
        invites.forEach {
            val emailCreateDto = EmailCreateDTO(inviteId = it.id, applicantId = it.applicantId, type = EmailType.reminder)
            val (applicant, invite) = mailSenderService.checkData(emailCreateDto)

            mailSenderService.sendMail(
                emailCreateDto,
                applicant,
                invite
            )
            log.info("Requested to send email to applicant of invite ${it.id}")
        }
    }

    private fun getReminderInvites(startDate: LocalDate, endDate: LocalDate, status: InviteStatus): List<InviteReadDTO> {
        return inviteReadService.getPaginatedAttributesWithDateRange(
            null, startDate, endDate, AllowedInvitesDateAttributeNames.expiresAt.toString(), listOf("status"), listOf(status)
        ).data
    }

    @Scheduled(cron = "0 * * * * *") // Cron expression for running every minute
    fun closeAssessment() {
        log.info("Started to check if started assessments need to be closed")
        executeCloseAssessment(getToBeFinishedInvites())
    }

    private fun executeCloseAssessment(invites: List<InviteReadDTO>) {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        invites.forEach {
            timingPerSectionRepository.save(timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(it.id, now))
            inviteUpdateInternalService.update(InviteUpdateInternalDTO(id = it.id, status = InviteStatus.expired, assessmentFinishedAt = now))
            log.info("Closed the assessment with inviteId ${it.id} at $now")
        }
    }

    private fun getToBeFinishedInvites(): List<InviteReadDTO> {
        return inviteReadService.getAllToBeFinishedInvites()
    }
}