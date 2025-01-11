package ut.isep.management.service.email


import dto.email.EmailCreateDTO
import dto.email.EmailDTO
import enumerable.EmailType
import jakarta.mail.internet.MimeMessage
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.MailSendException
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import ut.isep.management.controller.EmailController
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.InviteRepository
import java.time.Duration
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

@Service
class MailSenderService(
    private val emailSender: JavaMailSender,
    private val applicantRepository: ApplicantRepository,
    private val inviteRepository: InviteRepository
) {

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
    fun sendMail(emailCreateDTO: EmailCreateDTO, applicant: Applicant, invite: Invite) {
        try {
            val formattedExpDate = getFormattedExpDate(invite.expiresAt)
            val formattedTimeLeft = getFormattedTimeLeft(invite.expiresAt)

            val subject: String = when (emailCreateDTO.type) {
                EmailType.invitation -> "Invitation mail for InfoSupport Assessment |"
                EmailType.reminder -> "Reminder mail for InfoSupport Assessment |"
                else -> throw MailSendException("Invalid email type")
            }

            val additionalMessage = emailCreateDTO.additionalMessage ?: ""

            val msg = applicant.email?.let {
                EmailDTO(
                    to = it,
                    subject = "$subject ${applicant.name}",
                    inviteLink = "http://localhost:5174/${invite.id}",
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
            if (msg != null) {
                emailSender.send(msg)
            }
        } catch (e: Exception) {
            print("Failed to send email ${e.message}")
            throw MailSendException("Failed to send email", e)
        }
    }

    private fun createSimpleMessage(emailMessage: EmailDTO): MimeMessage {
        val message: MimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true)

        helper.setTo(emailMessage.to)
        helper.setSubject(emailMessage.subject)

        val template: String = when (emailMessage.type) {
            EmailType.invitation -> "/templates/inviteMail.html"
            EmailType.reminder -> "/templates/reminderMail.html"
            else -> throw MailSendException("Invalid email type")
        }

        val inputStream = EmailController::class.java.getResourceAsStream(template)
        requireNotNull(inputStream).use { stream ->
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

            helper.setText(emailContent, true)
        }

        val resource = ClassPathResource("img/infoSupportLogo.png")
        require(resource.exists()) {
            throw IllegalArgumentException("Resource not found: /img/infoSupportLogo.png")
        }

        helper.addInline("infoSupportLogo.png", resource)

        return message
    }

    private fun getFormattedTimeLeft(expiresAt: OffsetDateTime): String {
        val today = LocalDateTime.now()
        val timeDiff = Duration.between(today, expiresAt)
        val days = timeDiff.toDays()
        val hoursPart = timeDiff.toHoursPart()
        return if (days == 0L) {
            "$hoursPart hr"
        } else {
            "$days days and $hoursPart hr"
        }
    }

    private fun getFormattedExpDate(expiresAt: OffsetDateTime): String {
        val formatterExpDate = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy HH:mm 'UTC'")
        return expiresAt.format(formatterExpDate)
    }
}