package ut.isep.management.service.email


import dto.email.EmailCreateDTO
import dto.email.EmailDTO
import enumerable.EmailType
import enumerable.InviteStatus
import jakarta.mail.internet.MimeMessage
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.MailException
import org.springframework.mail.MailSendException
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.controller.EmailController
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.util.logger
import java.io.InputStream
import java.time.Duration
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Transactional
@Service
class MailSenderService(
    private val emailSender: JavaMailSender,
    private val applicantRepository: ApplicantRepository,
    private val inviteRepository: InviteRepository
) {

    private val log = logger()

    fun checkData(emailCreateDTO: EmailCreateDTO): Pair<Applicant, Invite> {
        val applicant = applicantRepository.findById(emailCreateDTO.applicantId)
            .orElseThrow { NoSuchElementException("Applicant not found") }

        val invite = inviteRepository.findById(emailCreateDTO.inviteId)
            .orElseThrow { NoSuchElementException("Invite not found") }

        if (applicant.invites.none { it.id == invite.id }) {
            throw NoSuchElementException("Provided invite does not belong to applicant")
        }

        return Pair(applicant, invite)
    }

    @Async
    fun processMail(emailCreateDTO: EmailCreateDTO, applicant: Applicant, invite: Invite) {
        val formattedExpDate = getFormattedExpDate(invite.expiresAt)
        val formattedTimeLeft = getFormattedTimeLeft(invite.expiresAt, OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC))

        val subject: String = getSubjectGeneral(emailCreateDTO)

        val additionalMessage = emailCreateDTO.additionalMessage ?: ""

        val msg = getMessage(applicant, subject, invite, formattedExpDate, emailCreateDTO, formattedTimeLeft, additionalMessage)
        sendMail(msg, applicant, invite)

        updateStatus(emailCreateDTO, invite)
    }

    private fun getFormattedExpDate(expiresAt: OffsetDateTime): String {
        val formatterExpDate = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy HH:mm 'UTC'")
        return expiresAt.format(formatterExpDate)
    }

    private fun getFormattedTimeLeft(expiresAt: OffsetDateTime, today: OffsetDateTime): String {
        val timeDiff = Duration.between(today, expiresAt)
        val days = timeDiff.toDays()
        val hoursPart = timeDiff.toHoursPart()
        return if (days == 0L) {
            "$hoursPart hr"
        } else {
            "$days day(s) and $hoursPart hr"
        }
    }

    private fun getSubjectGeneral(emailCreateDTO: EmailCreateDTO): String {
        val subject: String = when (emailCreateDTO.type) {
            EmailType.invitation -> "Invitation mail for InfoSupport Assessment |"
            EmailType.reminder -> "Reminder mail for InfoSupport Assessment |"
            else -> throw MailSendException("Invalid email type")
        }
        return subject
    }

    private fun getMessage(
        applicant: Applicant,
        subject: String,
        invite: Invite,
        formattedExpDate: String,
        emailCreateDTO: EmailCreateDTO,
        formattedTimeLeft: String,
        additionalMessage: String
    ): MimeMessage? {
        val msg = applicant.email?.let {
            EmailDTO(
                to = it,
                subject = "$subject ${applicant.name}",
                inviteLink = "http://localhost:5300/${invite.id}", //FIXME: replace with actual link of production system
                expirationDate = formattedExpDate,
                type = emailCreateDTO.type,
                timeLeft = formattedTimeLeft,
                additionalMessage = additionalMessage
            )
        }?.let {
            createSimpleMessage(
                it
            )
        }
        return msg
    }

    private fun sendMail(msg: MimeMessage?, applicant: Applicant, invite: Invite) {
        if (msg != null) {
            try {
                emailSender.send(msg)
                log.info("Successfully sent email to ${applicant.name}<${applicant.email}> for invite ${invite.id}")
            } catch (ex: MailException) {
                log.error(ex.message, ex)
            }
        } else {
            throw MailSendException("No email message available to send")
        }
    }

    private fun updateStatus(emailCreateDTO: EmailCreateDTO, invite: Invite) {
        if (emailCreateDTO.type == EmailType.reminder && invite.status !== InviteStatus.app_reminded_once) {
            invite.status = InviteStatus.app_reminded_once
        } else if (emailCreateDTO.type == EmailType.reminder && invite.status === InviteStatus.app_reminded_once) {
            invite.status = InviteStatus.app_reminded_twice
        }
        inviteRepository.save(invite)
    }


    private fun createSimpleMessage(emailMessage: EmailDTO): MimeMessage {
        val message: MimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true)

        helper.setTo(emailMessage.to)
        helper.setSubject(emailMessage.subject)

        val template: String = getTemplate(emailMessage)

        val inputStream = EmailController::class.java.getResourceAsStream(template)
        requireNotNull(inputStream).use { stream ->
            val emailContent = insertInformation(stream, emailMessage)

            helper.setText(emailContent, true)
        }

        insertInfoSupportLogo(helper)

        return message
    }

    private fun getTemplate(emailMessage: EmailDTO): String {
        val template: String = when (emailMessage.type) {
            EmailType.invitation -> "/templates/inviteMail.html"
            EmailType.reminder -> "/templates/reminderMail.html"
            else -> throw MailSendException("Invalid email type")
        }
        return template
    }

    private fun insertInformation(stream: InputStream, emailMessage: EmailDTO): String {
        var emailContent = stream.readBytes().toString(Charsets.UTF_8)
            .replace("{{INVITE_LINK}}", emailMessage.inviteLink)
            .replace("{{EXPIRATION_DATE}}", emailMessage.expirationDate)

        if (emailMessage.type == EmailType.invitation) {
            emailContent = if (emailMessage.additionalMessage != "") {
                emailContent.replace("{{ADDITIONAL_MESSAGE}}", emailMessage.additionalMessage)
            } else {
                emailContent.replace("{{ADDITIONAL_MESSAGE}}", "")
            }
        }

        if (emailMessage.type == EmailType.reminder) {
            emailContent = emailContent.replace("{{TIME_LEFT}}", emailMessage.timeLeft)
        }
        return emailContent
    }

    private fun insertInfoSupportLogo(helper: MimeMessageHelper) {
        val resource = ClassPathResource("img/infoSupportLogo.png")
        require(resource.exists()) {
            throw IllegalArgumentException("Resource not found: /img/infoSupportLogo.png")
        }

        helper.addInline("infoSupportLogo.png", resource)
    }
}
