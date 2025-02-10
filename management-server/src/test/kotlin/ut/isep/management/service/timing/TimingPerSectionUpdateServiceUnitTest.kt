package ut.isep.management.service.timing

import dto.timing.TimingPerSectionInSecondsUpdateDTO
import dto.timing.TimingPerSectionSwitchUpdateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.exception.TooManyRegisteredTimedObjectsException
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.model.entity.TimingPerSectionId
import ut.isep.management.repository.TimingPerSectionRepository
import java.lang.reflect.InvocationTargetException
import java.time.OffsetDateTime
import java.util.*

class TimingPerSectionUpdateServiceUnitTest {
    private val timingPerSectionRepository: TimingPerSectionRepository = mockk()
    private val timingPerSectionUpdateService: TimingPerSectionUpdateService = TimingPerSectionUpdateService(timingPerSectionRepository)

    private val inviteId = UUID.randomUUID()
    private val sectionId = 1L
    private val key = TimingPerSectionId(inviteId, sectionId)

    @Test
    fun `test updateTiming() that TimingPerSectionInSecondsUpdateDTO is saved`() {
        val updateDTO = TimingPerSectionInSecondsUpdateDTO(id = sectionId, seconds = 30)
        val measuredTimeSection = mockk<TimingPerSection>(relaxed = true) {
            var secondsValue = 0L
            every { invite } answers { Invite(id = inviteId) }
            every { seconds } answers { secondsValue }
            every { seconds = any() } answers { secondsValue = it.invocation.args[0] as Long }
        }

        every { timingPerSectionRepository.findById(key) } returns Optional.of(measuredTimeSection)
        every { timingPerSectionRepository.save(measuredTimeSection) } returns measuredTimeSection

        timingPerSectionUpdateService.updateTiming(inviteId, updateDTO)

        assertThat(measuredTimeSection.seconds).isEqualTo(updateDTO.seconds)
        verify { timingPerSectionRepository.findById(key) }
        verify { timingPerSectionRepository.save(measuredTimeSection) }
    }


    @Test
    fun `test updateTiming() that previous and next section timing are saved`() {
        val updateDTO = TimingPerSectionSwitchUpdateDTO(id = sectionId, seconds = null)
        val measuredTimeSectionPrevious = mockk<TimingPerSection>(relaxed = true) {
            every { invite } answers { Invite(id = inviteId) }
        }
        val measuredTimeSectionNext = mockk<TimingPerSection>(relaxed = true) {
            every { invite } answers { Invite(id = inviteId) }
        }

        every { timingPerSectionRepository.findByInviteIdAndVisitedAtNotNull(inviteId) } returns listOf(measuredTimeSectionPrevious)
        every { timingPerSectionRepository.findById(key) } returns Optional.of(measuredTimeSectionNext)
        every { timingPerSectionRepository.saveAll(any<List<TimingPerSection>>()) } answers { firstArg() }

        timingPerSectionUpdateService.updateTiming(inviteId, updateDTO)

        verify { timingPerSectionRepository.saveAll(listOf(measuredTimeSectionPrevious, measuredTimeSectionNext)) }
    }


    @Test
    fun `test setMeasuredSecondsPreviousSection() that TooManyRegisteredTimedObjectsException is thrown when more than 1 section`() {
        every { timingPerSectionRepository.findByInviteIdAndVisitedAtNotNull(inviteId) } returns listOf(mockk(), mockk())

        val exception = assertThrows<TooManyRegisteredTimedObjectsException> {
            timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(inviteId, OffsetDateTime.now())
        }

        assertThat(exception.message).contains("2 section have a timestamp")
    }

    @Test
    fun `test setMeasuredSecondsPreviousSection() that IllegalStateException is thrown when no section timestamp can be found`() {
        every { timingPerSectionRepository.findByInviteIdAndVisitedAtNotNull(inviteId) } returns emptyList()

        val exception = assertThrows<IllegalStateException> {
            timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(inviteId, OffsetDateTime.now())
        }

        assertThat(exception.message).contains("No section with a timestamp found")
    }

    @Test
    fun `test setMeasuredSecondsPreviousSection() that TimingPerSection of previous section is returned`() {
        val previousSection = mockk<TimingPerSection>(relaxed = true) {
            every { visitedAt } returns OffsetDateTime.now().minusSeconds(100)
        }

        every { timingPerSectionRepository.findByInviteIdAndVisitedAtNotNull(inviteId) } returns listOf(previousSection)

        val result = timingPerSectionUpdateService.setMeasuredSecondsPreviousSection(inviteId, OffsetDateTime.now())

        assertThat(result).isEqualTo(previousSection)
    }


    @Test
    fun `test getMeasuredTimeEntity() that NoSuchElementException is thrown when no measured time for section can be found`() {
        every { timingPerSectionRepository.findById(key) } returns Optional.empty()

        val getMeasuredTimeEntity = timingPerSectionUpdateService.javaClass.getDeclaredMethod("getMeasuredTimeEntity", UUID::class.java, Long::class.java)
        getMeasuredTimeEntity.isAccessible = true

        val exception = assertThrows<NoSuchElementException> {
            try {
                getMeasuredTimeEntity.invoke(timingPerSectionUpdateService, inviteId, sectionId) as TimingPerSection
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("No existing measured time for section ID: $sectionId")
    }

    @Test
    fun `test getMeasuredTimeEntity() that UnsupportedOperationException is thrown when measuredTimeSection doesn't have te correct invite id`() {
        val measuredTimeSection = mockk<TimingPerSection> {
            every { invite?.id } returns UUID.randomUUID()
        }

        every { timingPerSectionRepository.findById(key) } returns Optional.of(measuredTimeSection)

        val getMeasuredTimeEntity = timingPerSectionUpdateService.javaClass.getDeclaredMethod("getMeasuredTimeEntity", UUID::class.java, Long::class.java)
        getMeasuredTimeEntity.isAccessible = true

        val exception = assertThrows<UnsupportedOperationException> {
            try {
                getMeasuredTimeEntity.invoke(timingPerSectionUpdateService, inviteId, sectionId) as TimingPerSection
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("Cannot update measuredTimeSection that don't belong to your invite")
    }

    @Test
    fun `test getMeasuredTimeEntity() that UnsupportedOperationException is thrown when measuredTimeSection doesn't have te correct invite`() {
        val measuredTimeSection = mockk<TimingPerSection> {
            every { invite } answers { null }
        }

        every { timingPerSectionRepository.findById(key) } returns Optional.of(measuredTimeSection)

        val getMeasuredTimeEntity = timingPerSectionUpdateService.javaClass.getDeclaredMethod("getMeasuredTimeEntity", UUID::class.java, Long::class.java)
        getMeasuredTimeEntity.isAccessible = true

        val exception = assertThrows<UnsupportedOperationException> {
            try {
                getMeasuredTimeEntity.invoke(timingPerSectionUpdateService, inviteId, sectionId) as TimingPerSection
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("Cannot update measuredTimeSection that don't belong to your invite")
    }

    @Test
    fun `test getMeasuredTimeEntity() that TimingPerSection is returned`() {
        val measuredTimeSection = mockk<TimingPerSection>(relaxed = true) {
            every { invite?.id } returns inviteId
        }

        every { timingPerSectionRepository.findById(key) } returns Optional.of(measuredTimeSection)

        val getMeasuredTimeEntity = timingPerSectionUpdateService.javaClass.getDeclaredMethod("getMeasuredTimeEntity", UUID::class.java, Long::class.java)
        getMeasuredTimeEntity.isAccessible = true

        val result = getMeasuredTimeEntity.invoke(timingPerSectionUpdateService, inviteId, sectionId) as TimingPerSection

        assertThat(result).isEqualTo(measuredTimeSection)
    }
}