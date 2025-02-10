package ut.isep.management.scheduler

import dto.invite.InviteReadDTO
import dto.invite.InviteUpdateDTO
import enumerable.InviteStatus
import io.mockk.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.email.MailSenderService
import ut.isep.management.service.invite.InviteReadService
import ut.isep.management.service.invite.InviteUpdateInternalService
import ut.isep.management.service.invite.InviteUpdateService
import ut.isep.management.service.timing.TimingPerSectionUpdateService
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

class ScheduledTasksUnitTest {
    private val inviteReadService: InviteReadService = mockk()
    private val inviteUpdateService: InviteUpdateService = mockk()
    private val inviteUpdateInternalService: InviteUpdateInternalService = mockk()
    private val mailSenderService: MailSenderService = mockk()
    private val timingPerSectionRepository: TimingPerSectionRepository = mockk()
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService = mockk()

    private val scheduledTasks: ScheduledTasks = ScheduledTasks(
        inviteReadService,
        inviteUpdateService,
        inviteUpdateInternalService,
        mailSenderService,
        timingPerSectionRepository,
        timingPerSectionUpdateService
    )

    private val scheduledTasksSpy: ScheduledTasks = spyk(ScheduledTasks(mockk(), mockk(), mockk(), mockk(), mockk(), mockk()), recordPrivateCalls = true)

    @BeforeEach
    fun setUp() {
        clearMocks(scheduledTasksSpy, answers = false)
    }

    
    @Test
    fun `test expirationCheck()`() {
        scheduledTasksSpy.expirationCheck()

        verify { scheduledTasksSpy.expirationCheck() }
    }

    @Test
    fun `test expirationCheck() does not throw exceptions`() {
        every { inviteReadService.getPaginatedAttributesWithDateRange(any(), any(), any(), any(), any(), any()) } throws RuntimeException("Database error")

        assertDoesNotThrow { scheduledTasks.expirationCheck() }
    }


    @Test
    fun `test sendReminders()`() {
        scheduledTasksSpy.sendReminders()

        verify { scheduledTasksSpy.sendReminders() }
    }

    @Test
    fun `test sendReminders() does not throw exceptions`() {
        every { inviteReadService.getPaginatedAttributesWithDateRange(any(), any(), any(), any(), any(), any()) } throws RuntimeException("Database error")

        assertDoesNotThrow { scheduledTasks.sendReminders() }
    }


    @Test
    fun `test closeAssessment()`() {
        scheduledTasksSpy.closeAssessment()

        verify { scheduledTasksSpy.closeAssessment() }
    }

    @Test
    fun `test closeAssessment() does not throw exceptions`() {
        every { inviteReadService.getAllToBeFinishedInvites() } throws RuntimeException("Database error")

        assertDoesNotThrow { scheduledTasks.closeAssessment() }
    }
}