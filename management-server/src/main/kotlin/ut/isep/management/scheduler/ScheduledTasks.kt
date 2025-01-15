package ut.isep.management.scheduler

import dto.email.EmailCreateDTO
import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import enumerable.AllowedInvitesDateAttributeNames
import enumerable.EmailType
import enumerable.InviteStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import ut.isep.management.service.applicant.ApplicantReadService
import ut.isep.management.service.converter.applicant.ApplicantReadConverter
import ut.isep.management.service.email.MailSenderService
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.invite.InviteUpdateService
import ut.isep.management.util.logger
import java.time.LocalDate

@Component
class ScheduledTasks(
    private val inviteReadService: InviteReadService,
    private val inviteUpdateService: InviteUpdateService,
    private val mailSenderService: MailSenderService,
    private val applicantReadService: ApplicantReadService,
    private val applicantReadConverter: ApplicantReadConverter,
) {

    private val log = logger()

    @Scheduled(cron = "0 * * * * *") // Cron expression for running every hour
    fun expirationCheck() {
        val checkList = listOf(InviteStatus.not_started, InviteStatus.app_reminded_once, InviteStatus.app_reminded_twice)
        checkList.forEach {
            log.info("Started to check invites with the status $it for expiration")
            executeSetExpired(getExpirationInvites(it))
            log.info("Finished to check invites with the status $it for expiration")
        }
    }

    private fun executeSetExpired(invites: List<InviteReadDTO>) {
        invites.forEach {
            inviteUpdateService.update(InviteUpdateDTO(id = it.id, status = InviteStatus.expired, expiresAt = it.expiresAt))
        }
    }

    private fun getExpirationInvites(status: InviteStatus): List<InviteReadDTO> {
        val today = LocalDate.now()
        return inviteReadService.getPaginatedAttributesWithDateRange(
            null, null, today, AllowedInvitesDateAttributeNames.expiresAt.toString(), listOf("status"), listOf(status)
        ).data
    }

    @Scheduled(cron = "0 * * * * *") // Cron expression for running every hour
    fun sendReminders() {
        val checkList = listOf(InviteStatus.not_started, InviteStatus.app_reminded_once)
        val fiveDaysPrior = LocalDate.now().minusDays(4)
        val fourDaysPrior = LocalDate.now().minusDays(4)
        val twoDaysPrior = LocalDate.now().minusDays(2)
        val oneDayPrior = LocalDate.now().minusDays(1)
        checkList.forEach {
            log.info("Started to send reminder mails to invites with the status $it")
            var startDate = fiveDaysPrior
            var endDate = fourDaysPrior
            if (it == InviteStatus.app_reminded_once) {
                startDate = twoDaysPrior
                endDate = oneDayPrior
            }
            executeSendReminder(getReminderInvites(startDate, endDate, it))
            log.info("Finished to send reminder mails to invites with the status $it")
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
        }
    }

    private fun getReminderInvites(startDate: LocalDate, endDate: LocalDate, status: InviteStatus): List<InviteReadDTO> {
        return inviteReadService.getPaginatedAttributesWithDateRange(
            null, startDate, endDate, AllowedInvitesDateAttributeNames.expiresAt.toString(), listOf("status"), listOf(status)
        ).data
    }
}