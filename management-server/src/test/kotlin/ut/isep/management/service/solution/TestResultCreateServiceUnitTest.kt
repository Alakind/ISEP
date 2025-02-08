package ut.isep.management.service.solution

import dto.testresult.TestResultCreateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.model.entity.*
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.repository.TestResultRepository
import java.util.*

class TestResultCreateServiceUnitTest {
    private val testResultRepository: TestResultRepository = mockk()
    private val solvedAssignmentRepository: SolvedAssignmentRepository = mockk()
    private val testResultCreatService = TestResultCreateService(testResultRepository, solvedAssignmentRepository)

    private val inviteId = UUID.randomUUID()
    private val testResultCreateDTO = TestResultCreateDTO(
        assignmentId = 1L,
        inviteId = inviteId,
        name = "null-test",
        passed = false,
        message = "can't be null"
    )
    private val key = SolvedAssignmentId(testResultCreateDTO.inviteId, testResultCreateDTO.assignmentId)

    @Test
    fun `test create() that NoSuchElementException is thrown if solved assignment does not exist`() {
        every { solvedAssignmentRepository.findById(key) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            testResultCreatService.create(testResultCreateDTO)
        }
        assertThat(exception.message).isEqualTo("Solved assignment not found")
    }

    @Test
    fun `test create() that ClassCastException is thrown if SolvedAssignment cannot be cast to SolvedAssignmentCoding`() {
        val inviteId = UUID.randomUUID()
        val solvedAssignmentNotCoding = SolvedAssignmentOpen(
            id = SolvedAssignmentId(inviteId, 1L),
            assignment = Assignment(1L),
            invite = Invite(inviteId)
        )
        every { solvedAssignmentRepository.findById(key) } returns Optional.of(solvedAssignmentNotCoding)

        val exception = assertThrows<ClassCastException> {
            testResultCreatService.create(testResultCreateDTO)
        }
        assertThat(exception.message).isEqualTo("Expected SolvedAssignmentCoding but found SolvedAssignmentOpen")
    }

    @Test
    fun `test create() that test result is saved`() {
        val inviteId = UUID.randomUUID()

        val solvedAssignmentCoding = mockk<SolvedAssignmentCoding>(relaxed = true) {
            every { id } returns SolvedAssignmentId(inviteId, 1L)
            every { assignment } returns Assignment(1L)
            every { invite } returns Invite(inviteId)
        }

        val testResultSlot = slot<TestResult>()

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(solvedAssignmentCoding)
        every { solvedAssignmentRepository.save(solvedAssignmentCoding as SolvedAssignment) } returns solvedAssignmentCoding
        every { testResultRepository.save(capture(testResultSlot)) } answers { testResultSlot.captured }

        val result = testResultCreatService.create(testResultCreateDTO)

        assertThat(result).isEqualTo(testResultSlot.captured)
        verify { testResultRepository.save(testResultSlot.captured) }
    }

    @Test
    fun `test create() that the related solved assignment has the test results as well`() {
        val inviteId = UUID.randomUUID()

        val solvedAssignmentCoding = mockk<SolvedAssignmentCoding>(relaxed = true) {
            every { id } returns SolvedAssignmentId(inviteId, 1L)
            every { assignment } returns Assignment(1L)
            every { invite } returns Invite(inviteId)
            every { testResults } returns mutableListOf()
        }

        val testResultSlot = slot<TestResult>()

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(solvedAssignmentCoding)
        every { solvedAssignmentRepository.save(solvedAssignmentCoding as SolvedAssignment) } answers {
            solvedAssignmentCoding.testResults.add(testResultSlot.captured)
            solvedAssignmentCoding
        }
        every { testResultRepository.save(capture(testResultSlot)) } answers { testResultSlot.captured }

        val result = testResultCreatService.create(testResultCreateDTO)

        assertThat(solvedAssignmentCoding.testResults).contains(result)
        verify { solvedAssignmentRepository.save(solvedAssignmentCoding) }
    }
}