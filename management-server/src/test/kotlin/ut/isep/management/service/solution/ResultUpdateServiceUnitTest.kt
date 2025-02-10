package ut.isep.management.service.solution

import dto.assignment.ResultAssignmentUpdateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.model.entity.SolvedAssignmentOpen
import ut.isep.management.repository.SolvedAssignmentRepository
import java.util.*

class ResultUpdateServiceUnitTest {
    private val solvedAssignmentRepository: SolvedAssignmentRepository = mockk()
    private val resultUpdateService: ResultUpdateService = ResultUpdateService(solvedAssignmentRepository)

    private val inviteId = UUID.randomUUID()
    private val updateDTO = ResultAssignmentUpdateDTO(id = "1", 2)
    private val solvedAssignment = SolvedAssignmentOpen(
        id = SolvedAssignmentId(inviteId, updateDTO.id.toLong()),
        invite = Invite(id = UUID.randomUUID()),
    )

    @Test
    fun `test updateAssignment() that NoSuchElementException is thrown when solution can't be found`() {
        val key = SolvedAssignmentId(inviteId, updateDTO.id.toLong())
        every { solvedAssignmentRepository.findById(key) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultUpdateService.updateAssignment(inviteId, updateDTO)
        }
        assertThat(exception.message).isEqualTo("No existing solution for assignment ID: ${updateDTO.id}")
    }

    @Test
    fun `test updateAssignment() that UnsupportedOperationException is thrown when the invite id of the solution is not the same as the provided invite id (impossible to happen)`() {
        val key = SolvedAssignmentId(inviteId, updateDTO.id.toLong())
        every { solvedAssignmentRepository.findById(key) } returns Optional.of(solvedAssignment)

        val exception = assertThrows<UnsupportedOperationException> {
            resultUpdateService.updateAssignment(inviteId, updateDTO)
        }
        assertThat(exception.message).isEqualTo("Cannot update solvedAssignments that don't belong to your invite")
    }

    @Test
    fun `test updateAssignment() that UnsupportedOperationException is thrown when the invite null`() {
        val key = SolvedAssignmentId(inviteId, updateDTO.id.toLong())
        val solvedAssignment = SolvedAssignmentOpen(
            id = SolvedAssignmentId(inviteId, updateDTO.id.toLong()),
            invite = null
        )
        every { solvedAssignmentRepository.findById(key) } returns Optional.of(solvedAssignment)

        val exception = assertThrows<UnsupportedOperationException> {
            resultUpdateService.updateAssignment(inviteId, updateDTO)
        }
        assertThat(exception.message).isEqualTo("Cannot update solvedAssignments that don't belong to your invite")
    }

    @Test
    fun `test updateAssignment() that solution is saved`() {
        val existingSolution = mockk<SolvedAssignmentOpen>(relaxed = true) {
            every { invite?.id } returns inviteId
            var points: Int? = null
            every { scoredPoints } answers { points }
            every { scoredPoints = any() } answers { points = it.invocation.args[0] as Int? }
        }
        val key = SolvedAssignmentId(inviteId, updateDTO.id.toLong())

        val savedSlot = slot<SolvedAssignmentOpen>()

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(existingSolution)
        every { solvedAssignmentRepository.save(capture(savedSlot) as SolvedAssignment) } answers { savedSlot.captured }

        resultUpdateService.updateAssignment(inviteId, updateDTO)

        assertThat(savedSlot.captured.scoredPoints).isEqualTo(updateDTO.scoredPoints)
        verify { solvedAssignmentRepository.findById(key) }
        verify { solvedAssignmentRepository.save(existingSolution) }
    }

}