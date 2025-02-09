package ut.isep.management.service.assignment

import dto.assignment.ReferenceAssignmentReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import parser.question.Question
import ut.isep.management.model.entity.Assignment
import ut.isep.management.repository.AssignmentRepository
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter
import java.util.*

class ReferenceAssignmentReadServiceTest {

    private val repository: AssignmentRepository = mockk()
    private val fetchService: AsyncAssignmentFetchService = mockk()
    private val converter: ReferenceAssignmentReadConverter = mockk()
    private val referenceAssignmentReadService = ReferenceAssignmentReadService(repository, fetchService, converter)

    private val assignmentId = 1L
    private val commitHash = "testCommitHash"
    private val mockAssignment = mockk<Assignment>()
    private val mockFetchedQuestion = mockk<Question>()
    private val mockAssignmentDTO = mockk<ReferenceAssignmentReadDTO>()

    @Test
    fun `test getById() returns converted DTO when assignment exists`() {
        every { repository.findById(assignmentId) } returns Optional.of(mockAssignment)
        every { fetchService.fetchAssignment(mockAssignment, commitHash).block() } returns mockFetchedQuestion
        every { converter.toDTO(mockFetchedQuestion) } returns mockAssignmentDTO

        val result = referenceAssignmentReadService.getById(assignmentId, commitHash)

        assertEquals(mockAssignmentDTO, result)
        verify { repository.findById(assignmentId) }
        verify { fetchService.fetchAssignment(mockAssignment, commitHash).block() }
        verify { converter.toDTO(mockFetchedQuestion) }
    }

    @Test
    fun `test getById() throws NoSuchElementException when assignment is not found`() {
        every { repository.findById(assignmentId) } returns Optional.empty()

        val exception = assertThrows(NoSuchElementException::class.java) {
            referenceAssignmentReadService.getById(assignmentId, commitHash)
        }

        assertEquals("No assignment with ID $assignmentId", exception.message)

        verify { repository.findById(assignmentId) }
    }

    @Test
    fun `test getById() throws IllegalStateException when fetch service returns null`() {
        every { repository.findById(assignmentId) } returns Optional.of(mockAssignment)
        every { fetchService.fetchAssignment(mockAssignment, commitHash).block() } returns null

        val exception = assertThrows(IllegalStateException::class.java) {
            referenceAssignmentReadService.getById(assignmentId, commitHash)
        }

        assertEquals("Failed to fetch assignment with ID $assignmentId", exception.message)

        verify { repository.findById(assignmentId) }
        verify { fetchService.fetchAssignment(mockAssignment, commitHash).block() }
    }
}
