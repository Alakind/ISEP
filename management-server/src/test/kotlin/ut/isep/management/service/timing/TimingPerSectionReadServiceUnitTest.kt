package ut.isep.management.service.timing

import dto.timing.TimingPerSectionReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.model.entity.*
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.TimingPerSectionRepository
import ut.isep.management.service.converter.timing.TimingPerSectionReadConverter
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.*

class TimingPerSectionReadServiceUnitTest {
    private val timingPerSectionRepository: TimingPerSectionRepository = mockk()
    private val timingPerSectionReadConverter: TimingPerSectionReadConverter = mockk()
    private val inviteRepository: InviteRepository = mockk()
    private val timingPerSectionReadService: TimingPerSectionReadService = TimingPerSectionReadService(timingPerSectionRepository, timingPerSectionReadConverter, inviteRepository)

    private val inviteId = UUID.randomUUID()
    private val section = Section(id = 1L)
    private val key = TimingPerSectionId(inviteId, section.id)
    private val timingPerSection = TimingPerSection(id = key, seconds = 10)


    @Test
    fun `test getByMeasuredTimeSectionId() that NoSuchElementException is thrown when measured section can't be found`() {
        val key = TimingPerSectionId(inviteId, section.id)
        every { timingPerSectionRepository.findById(key) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            timingPerSectionReadService.getByMeasuredTimeSectionId(inviteId, section.id)
        }
        assertThat(exception.message).isEqualTo("No measured section with ID: $key")

        verify { timingPerSectionRepository.findById(key) }
    }

    @Test
    fun `test getByMeasuredTimeSectionId() that TimingPerSectionReadDTO is returned`() {
        every { timingPerSectionRepository.findById(key) } returns Optional.of(timingPerSection)

        val result = timingPerSectionReadService.getByMeasuredTimeSectionId(inviteId, section.id)

        val expectedDTO = TimingPerSectionReadDTO(
            seconds = 10
        )

        assertThat(result).isEqualTo(expectedDTO)

        verify { timingPerSectionRepository.findById(key) }
    }


    @Test
    fun `test getMeasuredTimeInvite() that NoSuchElementException is thrown when invite can't be found`() {
        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            timingPerSectionReadService.getMeasuredTimeInvite(inviteId)
        }
        assertThat(exception.message).isEqualTo("No invite found by provided ID")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getMeasuredTimeInvite() that 0 seconds is returned when invite_measuredSecondsPerSection_map { it_seconds } is empty`() {
        val invite = Invite(inviteId, measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key)))
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(seconds = 0)

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { timingPerSectionReadConverter.toDTO(any()) } returns timingPerSectionReadDTO

        val result = timingPerSectionReadService.getMeasuredTimeInvite(inviteId)

        assertThat(result).isEqualTo(timingPerSectionReadDTO)

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getMeasuredTimeInvite() that total time in seconds is returned when invite_measuredSecondsPerSection_map { it_seconds } is not empty`() {
        val invite = Invite(id = inviteId, measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)))
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(seconds = 10)

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { timingPerSectionReadConverter.toDTO(any()) } returns timingPerSectionReadDTO

        val result = timingPerSectionReadService.getMeasuredTimeInvite(inviteId)

        assertThat(result).isEqualTo(timingPerSectionReadDTO)

        verify { inviteRepository.findById(inviteId) }
        verify { timingPerSectionReadConverter.toDTO(any()) }
    }


    @Test
    fun `test getTimeLeft() that NoSuchElementException is thrown when invite can't be found`() {
        every { inviteRepository.findById(inviteId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("No invite found by provided ID")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that NoSuchFieldException is thrown when invite_assessment is null`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = null,
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NoSuchFieldException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("No assessment found by provided ID")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that NoSuchFieldException is thrown when invite_assessmentStartedAt is null`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(id = 1L),
            assessmentStartedAt = null
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<NoSuchFieldException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("No started assessment found by provided ID")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that IllegalStateException is thrown when the assessment has a time duration of zero or less (available seconds is null)`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(id = 1L),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<IllegalStateException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invalid assessment duration for invite: $inviteId")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that IllegalStateException is thrown when the assessment has a time duration of zero or less (available seconds is zero)`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(
                id = 1L,
                sections = mutableListOf(
                    Section(
                        id = 1L,
                        assignments = mutableListOf(
                            Assignment(availableSeconds = 0)
                        )
                    )
                )
            ),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<IllegalStateException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invalid assessment duration for invite: $inviteId")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that IllegalStateException is thrown when the assessment has a time duration of zero or less (available seconds is negative)`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(
                id = 1L,
                sections = mutableListOf(
                    Section(
                        id = 1L,
                        assignments = mutableListOf(
                            Assignment(availableSeconds = -10)
                        )
                    )
                )
            ),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC)
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<IllegalStateException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("Invalid assessment duration for invite: $inviteId")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that IllegalStateException is thrown when the assessment has been closed`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(
                id = 1L,
                sections = mutableListOf(
                    Section(
                        id = 1L,
                        assignments = mutableListOf(
                            Assignment(availableSeconds = 10)
                        )
                    )
                )
            ),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).minusSeconds(11)
        )
        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)

        val exception = assertThrows<IllegalStateException> {
            timingPerSectionReadService.getTimeLeft(inviteId)
        }
        assertThat(exception.message).isEqualTo("Assessment has been closed")

        verify { inviteRepository.findById(inviteId) }
    }

    @Test
    fun `test getTimeLeft() that TimingPerSectionReadDTO is returned`() {
        val invite = Invite(
            id = inviteId,
            measuredSecondsPerSection = mutableListOf(TimingPerSection(id = key, seconds = 10)),
            assessment = Assessment(
                id = 1L,
                sections = mutableListOf(
                    Section(
                        id = 1L,
                        assignments = mutableListOf(
                            Assignment(availableSeconds = 10)
                        )
                    )
                )
            ),
            assessmentStartedAt = OffsetDateTime.now().withOffsetSameInstant(ZoneOffset.UTC).minusSeconds(9)
        )
        val timingPerSectionReadDTO = TimingPerSectionReadDTO(
            seconds = 1
        )

        every { inviteRepository.findById(inviteId) } returns Optional.of(invite)
        every { timingPerSectionReadConverter.toDTO(any()) } returns timingPerSectionReadDTO

        val result = timingPerSectionReadService.getTimeLeft(inviteId)

        assertThat(result).isEqualTo(timingPerSectionReadDTO)

        verify { inviteRepository.findById(inviteId) }
    }

}