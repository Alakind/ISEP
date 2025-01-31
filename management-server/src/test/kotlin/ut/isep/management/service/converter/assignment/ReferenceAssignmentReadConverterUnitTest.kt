package ut.isep.management.service.converter.assignment

import dto.assignment.ReferenceAssignmentCodingReadDTO
import dto.assignment.ReferenceAssignmentMultipleChoiceReadDTO
import dto.assignment.ReferenceAssignmentOpenReadDTO
import dto.solution.AnswerCreateReadDTO
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import parser.question.*

class ReferenceAssignmentReadConverterUnitTest {
    private val referenceAssignmentConverter: ReferenceAssignmentReadConverter = mockk()

    private val codingQuestion = CodingQuestion(
        id = 1,
        filePath = "path/to/file",
        tags = listOf("tag1", "tag2"),
        description = "Description of the coding question",
        availablePoints = 10,
        availableSeconds = 600,
        language = "Java",
        files = CodeQuestionFiles(
            code = CodingFile("codeFile", "codeContent"),
            test = CodingFile("testFile", "testContent"),
            secretTest = CodingFile("secretTestFile", "secretTestContent"),
            referenceCode = CodingFile("referenceCodeFile", "referenceCodeContent"),
            referenceTest = CodingFile("referenceTestFile", "referenceTestContent")
        )
    )

    private val referenceAssignmentCodingReadDTO = ReferenceAssignmentCodingReadDTO(
        id = 1,
        description = "Description of the coding question",
        availablePoints = 10,
        availableSeconds = 600,
        language = "Java",
        code = "codeContent",
        test = "testContent",
        secretTest = "secretTestContent",
        referenceAnswer = AnswerCreateReadDTO.Coding("referenceCodeContent", "referenceTestContent")
    )

    private val multipleChoiceQuestion = MultipleChoiceQuestion(
        id = 2,
        filePath = "path/to/file",
        tags = listOf("tag1", "tag2"),
        description = "Multiple choice question",
        availablePoints = 5,
        availableSeconds = 300,
        options = listOf(
            MultipleChoiceQuestion.Option("Option 1", true),
            MultipleChoiceQuestion.Option("Option 2", false),
            MultipleChoiceQuestion.Option("Option 3", true)
        )
    )

    private val referenceMultipleChoiceReadDTO = ReferenceAssignmentMultipleChoiceReadDTO(
        id = 2,
        description = "Multiple choice question",
        availablePoints = 5,
        availableSeconds = 300,
        referenceAnswer = AnswerCreateReadDTO.MultipleChoice(listOf("Option1", "Option3")),
        options = listOf("Option1", "Option2", "Option3")
    )

    private val openQuestion = OpenQuestion(
        id = 3,
        filePath = "path/to/file",
        tags = listOf("tag1", "tag2"),
        description = "Open-ended question",
        availablePoints = 15,
        availableSeconds = 900,
        referenceAnswer = "This is the reference answer."
    )

    private val referenceOpenReadDTO = ReferenceAssignmentOpenReadDTO(
        id = 3,
        description = "Open-ended question",
        availablePoints = 15,
        availableSeconds = 900,
        referenceAnswer = AnswerCreateReadDTO.Open("This is the reference answer."),
    )

    @Test
    fun `should convert CodingQuestion to ReferenceAssignmentCodingReadDTO`() {
        // given
        every { referenceAssignmentConverter.toDTO(codingQuestion) } returns referenceAssignmentCodingReadDTO

        // when
        val result = referenceAssignmentConverter.toDTO(codingQuestion) as ReferenceAssignmentCodingReadDTO

        // then
        assertEquals(codingQuestion.id, result.id)
        assertEquals(codingQuestion.description, result.description)
        assertEquals(codingQuestion.availablePoints, result.availablePoints)
        assertEquals(codingQuestion.availableSeconds, result.availableSeconds)
        assertEquals(codingQuestion.language, result.language)
        assertEquals("codeContent", result.code)
        assertEquals("testContent", result.test)
        assertEquals("secretTestContent", result.secretTest)
        assertEquals("referenceCodeContent", result.referenceAnswer.code)
        assertEquals("referenceTestContent", result.referenceAnswer.test)
    }

    @Test
    fun `should convert MultipleChoiceQuestion to ReferenceAssignmentMultipleChoiceReadDTO`() {
        // given
        every { referenceAssignmentConverter.toDTO(multipleChoiceQuestion) } returns referenceMultipleChoiceReadDTO

        // Act
        val result = referenceAssignmentConverter.toDTO(multipleChoiceQuestion) as ReferenceAssignmentMultipleChoiceReadDTO

        // Assert
        assertEquals(multipleChoiceQuestion.id, result.id)
        assertEquals(multipleChoiceQuestion.description, result.description)
        assertEquals(multipleChoiceQuestion.availablePoints, result.availablePoints)
        assertEquals(multipleChoiceQuestion.availableSeconds, result.availableSeconds)
        assertEquals(listOf("Option1", "Option3"), result.referenceAnswer.answer)
    }

    @Test
    fun `should convert OpenQuestion to ReferenceAssignmentOpenReadDTO`() {
        // given
        every { referenceAssignmentConverter.toDTO(openQuestion) } returns referenceOpenReadDTO

        // when
        val result = referenceAssignmentConverter.toDTO(openQuestion) as ReferenceAssignmentOpenReadDTO

        // then
        assertEquals(openQuestion.id, result.id)
        assertEquals(openQuestion.description, result.description)
        assertEquals(openQuestion.availablePoints, result.availablePoints)
        assertEquals(openQuestion.availableSeconds, result.availableSeconds)
        assertEquals(openQuestion.referenceAnswer, result.referenceAnswer.answer)
    }

}