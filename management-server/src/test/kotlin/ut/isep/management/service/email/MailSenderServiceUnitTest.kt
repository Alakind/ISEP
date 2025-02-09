package ut.isep.management.service.email

import dto.email.EmailCreateDTO
import dto.email.EmailDTO
import enumerable.EmailType
import enumerable.InviteStatus
import io.mockk.*
import jakarta.mail.internet.MimeMessage
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertDoesNotThrow
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.MailSendException
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.util.logger
import java.io.InputStream
import java.lang.reflect.InvocationTargetException
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*
import kotlin.test.assertNotNull

@ExtendWith(MockitoExtension::class)
class MailSenderServiceUnitTest {

    private val emailSender: JavaMailSender = mockk(relaxed = true)
    private val applicantRepository: ApplicantRepository = mockk()
    private val inviteRepository: InviteRepository = mockk()
    private val mailSenderService = MailSenderService(emailSender, applicantRepository, inviteRepository)
    private val log = logger()

    @Test
    fun `test checkData() throws NosSuchElementException when applicant can't be found`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "Additional message")

        every { applicantRepository.findById(emailDTO.applicantId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            mailSenderService.checkData(emailDTO)
        }
        assertThat(exception.message).isEqualTo("Applicant not found")
    }

    @Test
    fun `test checkData() throws NosSuchElementException when invite can't be found`() {
        val applicant = mockk<Applicant>()
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "Additional message")

        every { applicantRepository.findById(emailDTO.applicantId) } returns Optional.of(applicant)
        every { inviteRepository.findById(emailDTO.inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            mailSenderService.checkData(emailDTO)
        }
        assertThat(exception.message).isEqualTo("Invite not found")
    }

    @Test
    fun `test checkData() throws NosSuchElementException when provided invite id can't be found in the invites belonging to the applicant`() {
        val applicant = mockk<Applicant> {
            every { invites } returns mutableListOf()
        }
        val invite = mockk<Invite>()
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "Additional message")

        every { applicantRepository.findById(emailDTO.applicantId) } returns Optional.of(applicant)
        every { inviteRepository.findById(emailDTO.inviteId) } returns Optional.of(invite)

        assertThrows<NoSuchElementException> {
            mailSenderService.checkData(emailDTO)
        }
    }

    @Test
    fun `test checkData() returns pair of applicant and invite`() {
        val inviteId = UUID.randomUUID()
        val applicant = mockk<Applicant> {
            every { invites } returns mutableListOf(mockk { every { id } returns inviteId })
        }
        val invite = mockk<Invite> { every { id } returns inviteId }
        val emailDTO = EmailCreateDTO(1L, inviteId, EmailType.invitation, "Additional message")

        every { applicantRepository.findById(emailDTO.applicantId) } returns Optional.of(applicant)
        every { inviteRepository.findById(emailDTO.inviteId) } returns Optional.of(invite)

        val result = mailSenderService.checkData(emailDTO)
        assertThat(result.first).isEqualTo(applicant)
        assertThat(result.second).isEqualTo(invite)
    }


    @Test
    fun `test processMail()`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "Additional message")
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).plusDays(3)
            every { id } returns UUID.randomUUID()
            every { status } returns InviteStatus.app_reminded_once
        }

        every { inviteRepository.save(invite) } returns Invite()

        mailSenderService.processMail(emailDTO, applicant, invite)

        verify { emailSender.send(any<MimeMessage>()) }
        verify { inviteRepository.save(invite) }
    }

    @Test
    fun `test processMail() with null additional message`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, null)
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).plusDays(3)
            every { id } returns UUID.randomUUID()
            every { status } returns InviteStatus.app_reminded_once
        }

        every { inviteRepository.save(invite) } returns invite

        mailSenderService.processMail(emailDTO, applicant, invite)

        verify { emailSender.send(any<MimeMessage>()) }
        verify { inviteRepository.save(invite) }
    }


    @Test
    fun `test getFormattedTimeLeft() formats time left as 'xxx hr' for less than a day`() {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val expiresAt = now.plusHours(3)

        val getFormattedTimeLeft = mailSenderService.javaClass.getDeclaredMethod("getFormattedTimeLeft", OffsetDateTime::class.java, OffsetDateTime::class.java)
        getFormattedTimeLeft.isAccessible = true

        val result = getFormattedTimeLeft.invoke(mailSenderService, expiresAt, now) as String
        assertThat(result).isEqualTo("3 hr")
    }

    @Test
    fun `test getFormattedTimeLeft() formats time left as 'xxx day(s) and xxx hr' for more than a day`() {
        val now = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        val expiresAt = now.plusHours(3).plusDays(3)

        val getFormattedTimeLeft = mailSenderService.javaClass.getDeclaredMethod("getFormattedTimeLeft", OffsetDateTime::class.java, OffsetDateTime::class.java)
        getFormattedTimeLeft.isAccessible = true

        val result = getFormattedTimeLeft.invoke(mailSenderService, expiresAt, now) as String
        assertThat(result).isEqualTo("3 day(s) and 3 hr")
    }


    @Test
    fun `test getFormattedExpDate() formats date as 'EEEE, d MMMM yyyy HH mm 'UTC''`() {
        val now = OffsetDateTime.of(2025, 1, 1, 10, 0, 0, 0, ZoneOffset.UTC)
        val expiresAt = now.plusHours(3).plusDays(3)

        val getFormattedExpDate = mailSenderService.javaClass.getDeclaredMethod("getFormattedExpDate", OffsetDateTime::class.java)
        getFormattedExpDate.isAccessible = true

        val result = getFormattedExpDate.invoke(mailSenderService, expiresAt) as String
        assertThat(result).isEqualTo("Saturday, 4 January 2025 13:00 UTC")
    }


    @Test
    fun `test getSubjectGeneral() with invitation mail type selects correct subject`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "")

        val getSubjectGeneral = mailSenderService.javaClass.getDeclaredMethod(
            "getSubjectGeneral", EmailCreateDTO::class.java
        )
        getSubjectGeneral.isAccessible = true

        val subject = getSubjectGeneral.invoke(mailSenderService, emailDTO)
        assertThat(subject).isEqualTo("Invitation mail for InfoSupport Assessment |")
    }

    @Test
    fun `test getSubjectGeneral() with reminder mail type selects correct subject`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.reminder, "")

        val getSubjectGeneral = mailSenderService.javaClass.getDeclaredMethod(
            "getSubjectGeneral", EmailCreateDTO::class.java
        )
        getSubjectGeneral.isAccessible = true

        val subject = getSubjectGeneral.invoke(mailSenderService, emailDTO)
        assertThat(subject).isEqualTo("Reminder mail for InfoSupport Assessment |")
    }

    @Test
    @Disabled("This can't ever be caused, because the Enum typing already catches this with a IllegalArgumentException: No enum constant enumerable.EmailType.xxx")
    fun `test getSubjectGeneral() throws MailSendException when invalid email type is provided`() {
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.valueOf("invalid"), "")

        val getSubjectGeneral = mailSenderService.javaClass.getDeclaredMethod(
            "getSubjectGeneral", EmailCreateDTO::class.java
        )
        getSubjectGeneral.isAccessible = true

        assertThrows<MailSendException> {
            try {
                getSubjectGeneral.invoke(mailSenderService, emailDTO)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }
    }


    @Test
    fun `test getMessage() when email is provided the message is not null`() {
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val subject = "Invitation mail for InfoSupport Assessment |"
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now()
            every { id } returns UUID.randomUUID()
            every { status } returns InviteStatus.not_started
        }
        val formattedExpDate = "Saturday, 4 January 2025 13:00 UTC"
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "")
        val formattedTimeLeft = "2 hr"
        val additionalMessage = ""

        val getMessage = mailSenderService.javaClass.getDeclaredMethod(
            "getMessage", Applicant::class.java, String::class.java, Invite::class.java, String::class.java, EmailCreateDTO::class.java, String::class.java, String::class.java
        )
        getMessage.isAccessible = true

        val msg = getMessage.invoke(mailSenderService, applicant, subject, invite, formattedExpDate, emailDTO, formattedTimeLeft, additionalMessage) as MimeMessage
        assertNotNull(msg)
    }

    @Test
    fun `test getMessage() when email is not provided the message is null`() {

        val applicant = mockk<Applicant> {
            every { email } returns null
            every { name } returns "John Doe"
        }
        val subject = "Invitation mail for InfoSupport Assessment |"
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now()
            every { id } returns UUID.randomUUID()
            every { status } returns InviteStatus.not_started
        }
        val formattedExpDate = "Saturday, 4 January 2025 13:00 UTC"
        val emailDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.invitation, "")
        val formattedTimeLeft = "2 hr"
        val additionalMessage = ""

        val getMessage = mailSenderService.javaClass.getDeclaredMethod(
            "getMessage", Applicant::class.java, String::class.java, Invite::class.java, String::class.java, EmailCreateDTO::class.java, String::class.java, String::class.java
        )
        getMessage.isAccessible = true

        val msg = getMessage.invoke(mailSenderService, applicant, subject, invite, formattedExpDate, emailDTO, formattedTimeLeft, additionalMessage)
        assertNull(msg)
    }


    @Test
    fun `test sendMail() when message is not null that 'Successfully sent email to xxx for invite xxx' is logged with info`() {
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val inviteId = UUID.randomUUID()
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now()
            every { id } returns inviteId
        }
        val msg = mockk<MimeMessage> {
            every { subject } returns "test"
        }

        val sendMail = mailSenderService.javaClass.getDeclaredMethod(
            "sendMail", MimeMessage::class.java, Applicant::class.java, Invite::class.java
        )
        sendMail.isAccessible = true

        sendMail.invoke(mailSenderService, msg, applicant, invite)

        verify { emailSender.send(any<MimeMessage>()) }
    }

    @Test
    fun `test sendMail() that a MailException is caught when a mail couldn't be sent`() {
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now()
            every { id } returns UUID.randomUUID()
        }
        val msg = mockk<MimeMessage> {
            every { subject } returns "test"
        }

        every { emailSender.send(msg) } throws MailSendException("Mail server error")

        val sendMail = mailSenderService.javaClass.getDeclaredMethod(
            "sendMail", MimeMessage::class.java, Applicant::class.java, Invite::class.java
        )
        sendMail.isAccessible = true

        assertDoesNotThrow {
            try {
                sendMail.invoke(mailSenderService, msg, applicant, invite)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        verify { emailSender.send(any<MimeMessage>()) }
    }

    @Test
    fun `test sendMail() that a MailSendException is caught when msg is null`() {
        val applicant = mockk<Applicant> {
            every { email } returns "test@example.com"
            every { name } returns "John Doe"
        }
        val invite = mockk<Invite> {
            every { expiresAt } returns OffsetDateTime.now()
        }

        val sendMail = mailSenderService.javaClass.getDeclaredMethod("sendMail", MimeMessage::class.java, Applicant::class.java, Invite::class.java)
        sendMail.isAccessible = true

        val exception = assertThrows<MailSendException> {
            try {
                sendMail.invoke(mailSenderService, null, applicant, invite)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }
        assertThat(exception.message).isEqualTo("No email message available to send")
    }


    @Test
    fun `test updateStatus() the invite status is changed when the first reminder is sent`() {
        val invite = mockk<Invite>(relaxed = true) {
            every { status } returns InviteStatus.not_started
        }
        val emailCreateDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.reminder, "Reminder email")

        every { inviteRepository.save(invite) } returns invite

        val updateStatus = mailSenderService.javaClass.getDeclaredMethod(
            "updateStatus", EmailCreateDTO::class.java, Invite::class.java
        )
        updateStatus.isAccessible = true

        updateStatus.invoke(mailSenderService, emailCreateDTO, invite)

        verify { invite.status = InviteStatus.app_reminded_once }
        verify { inviteRepository.save(invite) }
    }

    @Test
    fun `test updateStatus() the invite status is changed when the second reminder is sent`() {
        val invite = mockk<Invite>(relaxed = true) {
            every { status } returns InviteStatus.app_reminded_once
        }
        val emailCreateDTO = EmailCreateDTO(1L, UUID.randomUUID(), EmailType.reminder, "Second reminder email")

        every { inviteRepository.save(invite) } returns invite

        val updateStatus = mailSenderService.javaClass.getDeclaredMethod(
            "updateStatus", EmailCreateDTO::class.java, Invite::class.java
        )
        updateStatus.isAccessible = true

        updateStatus.invoke(mailSenderService, emailCreateDTO, invite)

        verify { invite.status = InviteStatus.app_reminded_twice }
        verify { inviteRepository.save(invite) }
    }


    @Test
    fun `test createSimpleMessage() sets the information from the emailMessage input`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Test Subject",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.invitation,
            timeLeft = "3 hr",
            additionalMessage = "Welcome to the test invite!"
        )

        val createSimpleMessage = mailSenderService.javaClass.getDeclaredMethod(
            "createSimpleMessage", EmailDTO::class.java
        )
        createSimpleMessage.isAccessible = true

        val mimeMessage = createSimpleMessage.invoke(mailSenderService, emailDTO) as MimeMessage
        println("size: " + mimeMessage.allRecipients.size)
        println("subject: " + mimeMessage.subject)
        println("to: " + mimeMessage.allRecipients)
        val helper = MimeMessageHelper(mimeMessage, true)

        verify { helper.setTo(emailDTO.to) }
        verify { helper.setSubject(emailDTO.subject) }
    }


    @Test
    @Disabled("Unknown enum is never possible or it will thrown an IllegalStateException")
    fun `test getTemplate() throws MailSendException when invalid email type is provided`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Invalid Email Type",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.valueOf("invalid"),
            timeLeft = "3 hr",
            additionalMessage = "Invalid template"
        )

        val getTemplate = mailSenderService.javaClass.getDeclaredMethod(
            "getTemplate", EmailCreateDTO::class.java
        )
        getTemplate.isAccessible = true

        val exception = assertThrows<MailSendException> {
            getTemplate.invoke(mailSenderService, emailDTO)
        }

        assertThat(exception.message).isEqualTo("Invalid email type")
    }

    @Test
    fun `test getTemplate() selects invite mail template with invitation email type`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Invitation Email",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.invitation,
            timeLeft = "3 hr",
            additionalMessage = "You're invited!"
        )

        val getTemplate = mailSenderService.javaClass.getDeclaredMethod(
            "getTemplate", EmailDTO::class.java
        )
        getTemplate.isAccessible = true

        val template = getTemplate.invoke(mailSenderService, emailDTO)

        assertThat(template).isEqualTo("/templates/inviteMail.html")
    }

    @Test
    fun `test getTemplate() selects reminder mail template with reminder email type`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Reminder Email",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.reminder,
            timeLeft = "3 hr",
            additionalMessage = "Reminder email!"
        )

        val getTemplate = mailSenderService.javaClass.getDeclaredMethod(
            "getTemplate", EmailDTO::class.java
        )
        getTemplate.isAccessible = true

        val template = getTemplate.invoke(mailSenderService, emailDTO)

        assertThat(template).isEqualTo("/templates/reminderMail.html")
    }


    @Test
    fun `test insertInformation() replaces all the injectable strings for invitation`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Email Subject",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.invitation,
            timeLeft = "3 hr",
            additionalMessage = "This is a test message!"
        )

        val templateContent = """
        <html>
        <body>
        <p>Invite link: {{INVITE_LINK}}</p>
        <p>Expires on: {{EXPIRATION_DATE}}</p>
        <p>Additional Message: {{ADDITIONAL_MESSAGE}}</p>
        </body>
        </html>
    """.trimIndent()

        val inputStream = templateContent.byteInputStream(Charsets.UTF_8)

        val insertInformation = mailSenderService.javaClass.getDeclaredMethod(
            "insertInformation", InputStream::class.java, EmailDTO::class.java
        )
        insertInformation.isAccessible = true

        val processedContent = insertInformation.invoke(mailSenderService, inputStream, emailDTO) as String

        assertThat(processedContent).contains(emailDTO.inviteLink)
        assertThat(processedContent).contains(emailDTO.expirationDate)
        assertThat(processedContent).contains(emailDTO.additionalMessage)
    }

    @Test
    fun `test insertInformation() replaces all the injectable strings for reminder`() {
        val emailDTO = EmailDTO(
            to = "test@example.com",
            subject = "Email Subject",
            inviteLink = "http://localhost:5300/invite",
            expirationDate = "Monday, 1 January 2025 12:00 UTC",
            type = EmailType.reminder,
            timeLeft = "3 hr",
            additionalMessage = "This is a test message!"
        )

        val templateContent = """
        <html>
        <body>
        <p>Invite link: {{INVITE_LINK}}</p>
        <p>Expires on: {{EXPIRATION_DATE}}</p>
        <p>Time left: {{TIME_LEFT}}</p>
        </body>
        </html>
    """.trimIndent()

        val inputStream = templateContent.byteInputStream(Charsets.UTF_8)

        val insertInformation = mailSenderService.javaClass.getDeclaredMethod(
            "insertInformation", InputStream::class.java, EmailDTO::class.java
        )
        insertInformation.isAccessible = true

        val processedContent = insertInformation.invoke(mailSenderService, inputStream, emailDTO) as String

        assertThat(processedContent).contains(emailDTO.inviteLink)
        assertThat(processedContent).contains(emailDTO.expirationDate)
        assertThat(processedContent).contains(emailDTO.timeLeft)
    }


    @Test
    fun `test insertInfoSupportLogo() injects the infoSupportLogo png`() {
        val message = mockk<MimeMessage>()
        val helper = mockk<MimeMessageHelper>(relaxed = true)

        every { helper.addInline(any(), any<ClassPathResource>()) } just Runs

        val insertInfoSupportLogo = mailSenderService.javaClass.getDeclaredMethod(
            "insertInfoSupportLogo", MimeMessageHelper::class.java
        )
        insertInfoSupportLogo.isAccessible = true

        insertInfoSupportLogo.invoke(mailSenderService, helper)

        verify { helper.addInline("infoSupportLogo.png", any<ClassPathResource>()) }
    }

    @Test
    fun `test insertInfoSupportLogo() throws IllegalArgumentException when resource png is not available`() {
        val helper = mockk<MimeMessageHelper>(relaxed = true)

        mockkConstructor(ClassPathResource::class)
        every { anyConstructed<ClassPathResource>().exists() } returns false

        val exception = assertThrows<IllegalArgumentException> {
            try {
                mailSenderService.javaClass.getDeclaredMethod("insertInfoSupportLogo", MimeMessageHelper::class.java)
                    .apply { isAccessible = true }
                    .invoke(mailSenderService, helper)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).isEqualTo("Resource not found: /img/infoSupportLogo.png")

        unmockkConstructor(ClassPathResource::class)
    }
}