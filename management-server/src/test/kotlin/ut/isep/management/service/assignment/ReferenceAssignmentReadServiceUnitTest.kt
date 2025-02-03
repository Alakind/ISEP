package ut.isep.management.service.assignment

import dto.assignment.ReferenceAssignmentCodingReadDTO
import dto.solution.AnswerCreateReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import parser.question.CodeQuestionFiles
import parser.question.CodingFile
import parser.question.CodingQuestion
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.repository.AssignmentRepository
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter
import java.util.*

class ReferenceAssignmentReadServiceUnitTest {
    private val assignmentRepository: AssignmentRepository = mockk()
    private val assignmentFetchService: AssignmentFetchService = mockk()
    private val referenceAssignmentReadConverter: ReferenceAssignmentReadConverter = mockk()
    private val referenceAssignmentReadService: ReferenceAssignmentReadService = ReferenceAssignmentReadService(assignmentRepository, assignmentFetchService, referenceAssignmentReadConverter)

    private val assignmentEntityCoding: Assignment = Assignment(1L, "/java/StringUtil/", AssignmentType.CODING, 10, 180)
    private val assignmentEntityOpen: Assignment = Assignment(2L, "/java/StringUtil/", AssignmentType.OPEN, 10, 180)
    private val assignmentEntityMc: Assignment = Assignment(3L, "/java/StringUtil/", AssignmentType.MULTIPLE_CHOICE, 10, 180)

    private val questionCoding: CodingQuestion = CodingQuestion(
        1L, listOf("Java Developer"), "Improve the code", "/java/StringUtil/Main.md", 10, 180, "Java", CodeQuestionFiles(
            CodingFile("", ""),
            CodingFile("", ""), CodingFile("", "")
        )
    )


    private val assignmentEntityCodingReadDto = ReferenceAssignmentCodingReadDTO(1L, "Improve the code", 10, 180, "Java", "System.out.println()", "", "", AnswerCreateReadDTO.Coding("", ""))
//    private val assignmentEntityOpenReadDto = ReferenceAssignmentOpenReadDTO()
//    private val assignmentEntityMcReadDto = ReferenceAssignmentMultipleChoiceReadDTO()

    @Test
    @Disabled
    fun whenGetById_thenReturnReferenceAssignmentReadDTO_coding() {
        // given
        every { assignmentRepository.findById(assignmentEntityCoding.id) } returns Optional.of(assignmentEntityCoding)
        every { assignmentFetchService.fetchAssignment(assignmentEntityCoding, "abc") }
        every { referenceAssignmentReadConverter.toDTO(questionCoding) } returns assignmentEntityCodingReadDto

        // when
        val result = referenceAssignmentReadService.getById(assignmentEntityCoding.id, "abc")

        // then
        verify(exactly = 1) { assignmentRepository.findById(assignmentEntityCoding.id) }
        verify(exactly = 1) { referenceAssignmentReadConverter.toDTO(questionCoding) }
        assertThat(result).isEqualTo(assignmentEntityCodingReadDto)
    }
}