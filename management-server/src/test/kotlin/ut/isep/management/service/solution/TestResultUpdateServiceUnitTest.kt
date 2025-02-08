package ut.isep.management.service.solution

import dto.assignment.TestResultUpdateDTO
import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ut.isep.management.model.entity.*
import ut.isep.management.repository.TestResultRepository
import java.util.*

class TestResultUpdateServiceUnitTest {
    private val testResultRepository: TestResultRepository = mockk()
    private val testResultUpdateService = TestResultUpdateService(testResultRepository)

    private val inviteId = UUID.randomUUID()
    private val testResultUpdateDTO = TestResultUpdateDTO(
        name = "new name",
        passed = true,
        message = "null value is not found",
        assignmentId = 1L,
        id = 1L,
        inviteId = inviteId
    )

    @Test
    fun `test update() that NoSuchElementException is thrown if test result does not exist`() {
        every { testResultRepository.findById(testResultUpdateDTO.id) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            testResultUpdateService.update(testResultUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("No existing test result for assignment ID: ${testResultUpdateDTO.id}")
    }

    @Test
    fun `test update() that UnsupportedOperationException is thrown if test result does not belong to the invite`() {
        val testResult = TestResult(
            id = 1L,
            name = "null-test",
            passed = false,
            message = "can't be null",
            solvedAssignmentCoding = SolvedAssignmentCoding(invite = Invite(id = UUID.randomUUID())),
        )

        every { testResultRepository.findById(testResultUpdateDTO.id) } returns Optional.of(testResult)

        val exception = assertThrows<UnsupportedOperationException> {
            testResultUpdateService.update(testResultUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Cannot update testResults that don't belong to your invite")
    }

    @Test
    fun `test update() that UnsupportedOperationException is thrown if test result does not belong to the assignment`() {
        val testResult = TestResult(
            id = 1L,
            name = "null-test",
            passed = false,
            message = "can't be null",
            solvedAssignmentCoding = SolvedAssignmentCoding(id = SolvedAssignmentId(inviteId = inviteId, assignmentId = 2L), invite = Invite(id = inviteId), assignment = Assignment(id = 2L)),
        )

        every { testResultRepository.findById(testResultUpdateDTO.id) } returns Optional.of(testResult)

        val exception = assertThrows<UnsupportedOperationException> {
            testResultUpdateService.update(testResultUpdateDTO)
        }
        assertThat(exception.message).isEqualTo("Cannot update testResults that don't belong to your assignment")
    }

    @Test
    fun `test update() that test result is saved with all attributes changed`() {
        val testResult = TestResult(
            id = 1L,
            name = "null-test",
            passed = false,
            message = "can't be null",
            solvedAssignmentCoding = SolvedAssignmentCoding(id = SolvedAssignmentId(inviteId = inviteId, assignmentId = 1L), invite = Invite(id = inviteId), assignment = Assignment(id = 1L)),
        )

        every { testResultRepository.findById(testResultUpdateDTO.id) } returns Optional.of(testResult)
        every { testResultRepository.save(testResult) } returns testResult

        testResultUpdateService.update(testResultUpdateDTO)

        assertThat(testResult.name).isEqualTo(testResultUpdateDTO.name)
        assertThat(testResult.message).isEqualTo(testResultUpdateDTO.message)
        assertThat(testResult.passed).isEqualTo(testResultUpdateDTO.passed)
    }

    @Test
    fun `test update() that test result is saved with name and passed null`() {
        val testResultUpdateDTO = TestResultUpdateDTO(
            name = null,
            passed = null,
            message = "null value is not found",
            assignmentId = 1L,
            id = 1L,
            inviteId = inviteId
        )
        val testResult = TestResult(
            id = 1L,
            name = "null-test",
            passed = false,
            message = "can't be null",
            solvedAssignmentCoding = SolvedAssignmentCoding(id = SolvedAssignmentId(inviteId = inviteId, assignmentId = 1L), invite = Invite(id = inviteId), assignment = Assignment(id = 1L)),
        )

        every { testResultRepository.findById(testResultUpdateDTO.id) } returns Optional.of(testResult)
        every { testResultRepository.save(testResult) } returns testResult

        testResultUpdateService.update(testResultUpdateDTO)

        assertThat(testResult.name).isNotEqualTo(testResultUpdateDTO.name)
        assertThat(testResult.message).isEqualTo(testResultUpdateDTO.message)
        assertThat(testResult.passed).isNotEqualTo(testResultUpdateDTO.passed)
    }
}