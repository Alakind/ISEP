//package ut.isep.management.service.assignment
//
//import dto.assignment.ReferenceAssignmentCodingReadDTO
//import dto.solution.AnswerCreateReadDTO
//import io.mockk.every
//import io.mockk.mockk
//import io.mockk.verify
//import org.assertj.core.api.Assertions.assertThat
//import org.junit.jupiter.api.Test
//import parser.question.CodeQuestionFiles
//import parser.question.CodingFile
//import parser.question.CodingQuestion
//import ut.isep.management.model.entity.Assignment
//import ut.isep.management.model.entity.AssignmentType
//import ut.isep.management.repository.AssignmentRepository
//import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter
//import java.util.*
//
//class ReferenceAssignmentReadServiceUnitTest {
//    private val assignmentRepository: AssignmentRepository = mockk()
//    private val assignmentFetchService: AsyncAssignmentFetchService = mockk()
//    private val referenceAssignmentReadConverter: ReferenceAssignmentReadConverter = mockk()
//    private val referenceAssignmentReadService: ReferenceAssignmentReadService = ReferenceAssignmentReadService(assignmentRepository, assignmentFetchService, referenceAssignmentReadConverter)
//
//    private val assignmentEntityCoding: Assignment = Assignment(1L, "/java/StringUtil/", AssignmentType.CODING, 10, 180)
//    private val assignmentEntityOpen: Assignment = Assignment(2L, "/java/StringUtil/", AssignmentType.OPEN, 10, 180)
//    private val assignmentEntityMc: Assignment = Assignment(3L, "/java/StringUtil/", AssignmentType.MULTIPLE_CHOICE, 10, 180)
//
//    private val questionCoding: CodingQuestion = CodingQuestion(
//        1L, listOf("Java Developer"), "Improve the code", "/java/StringUtil/Main.md", 10, 180, "Java", CodeQuestionFiles(
//            CodingFile("", ""),
//            CodingFile("", ""), CodingFile("", "")
//        )
//    )
//
//
//    private val assignmentEntityCodingReadDto = ReferenceAssignmentCodingReadDTO(1L, "Improve the code", 10, 180, "Java", "System.out.println()", "", "", AnswerCreateReadDTO.Coding("", ""))
////    private val assignmentEntityOpenReadDto = ReferenceAssignmentOpenReadDTO()
////    private val assignmentEntityMcReadDto = ReferenceAssignmentMultipleChoiceReadDTO()
//
//    @Test
////    @Disabled
//    fun whenGetById_thenReturnReferenceAssignmentReadDTO_coding() {
//        // given
//        every { assignmentRepository.findById(assignmentEntityCoding.id) } returns Optional.of(assignmentEntityCoding)
//        every { assignmentFetchService.fetchAssignment(assignmentEntityCoding, "abc") }
//        every { referenceAssignmentReadConverter.toDTO(questionCoding) } returns assignmentEntityCodingReadDto
//
//        // when
//        val result = referenceAssignmentReadService.getById(assignmentEntityCoding.id, "abc")
//
//        // then
//        verify(exactly = 1) { assignmentRepository.findById(assignmentEntityCoding.id) }
//        verify(exactly = 1) { referenceAssignmentReadConverter.toDTO(questionCoding) }
//        assertThat(result).isEqualTo(assignmentEntityCodingReadDto)
//    }
//}

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
    private val mockFetchedQuestion = mockk<Question>() // Mocked question (depends on actual return type)
    private val mockAssignmentDTO = mockk<ReferenceAssignmentReadDTO>()

    @Test
    fun `test getById() returns converted DTO when assignment exists`() {
        // Mock repository return
        every { repository.findById(assignmentId) } returns Optional.of(mockAssignment)

        // Mock fetch service to return a non-null value
        every { fetchService.fetchAssignment(mockAssignment, commitHash).block() } returns mockFetchedQuestion

        // Mock converter to return expected DTO
        every { converter.toDTO(mockFetchedQuestion) } returns mockAssignmentDTO

        // Execute the service method
        val result = referenceAssignmentReadService.getById(assignmentId, commitHash)

        // Assertions
        assertEquals(mockAssignmentDTO, result)

        // Verify interactions
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
