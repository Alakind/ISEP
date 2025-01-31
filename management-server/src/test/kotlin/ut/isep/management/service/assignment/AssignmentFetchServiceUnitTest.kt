package ut.isep.management.service.assignment

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.web.client.RestTemplate
import parser.Frontmatter
import parser.FrontmatterParser
import parser.OpenFrontmatter
import parser.QuestionParser
import parser.question.MultipleChoiceQuestion
import parser.question.OpenQuestion
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType

class AssignmentFetchServiceUnitTest {

    private lateinit var assignmentFetchService: AssignmentFetchService
    private lateinit var restTemplate: RestTemplate
    private lateinit var questionParser: QuestionParser
    private lateinit var frontmatterParser: FrontmatterParser

    @BeforeEach
    fun setup() {
        // Mock dependencies
        restTemplate = mockk()
        questionParser = mockk()
        frontmatterParser = mockk()

        // Initialize the service with mocked dependencies
        assignmentFetchService = AssignmentFetchService(restTemplate)
        assignmentFetchService.parser = questionParser
        assignmentFetchService.frontmatterParser = frontmatterParser
    }

//    @Test //FIXME: io.mockk.MockKException: no answer provided for CodingFrontmatter(#4).getCodeFilename())
//    fun `should fetch assignment for CODING type`() {
//        // variables
//        val assignment = Assignment(id = 1, baseFilePath = "path/to/codingfile.md", assignmentType = AssignmentType.CODING)
//        val commitHash = "commit123"
//
//        val fileContent = "dummy file content"
//        val frontmatter = mockk<CodingFrontmatter>()
//        val body = "dummy body"
//
//        // given
//        every { restTemplate.getForObject(any<String>(), String::class.java) } returns fileContent
//        every { frontmatter.codeFilename } returns "dummyCodeFile.java"
//        every { frontmatter.testFilename } returns "dummyTestFile.java"
//        every { frontmatter.secretTestFilename } returns "dummySecretTestFile.java"
//        every { frontmatter.referenceCodeFilename } returns "dummyReferenceCodeFile.java"
//        every { frontmatter.referenceTestFilename } returns "dummyReferenceTestFile.java"
//        every { frontmatterParser.parse(fileContent, "path/to/codingfile_qid1.md") } returns Pair(frontmatter, body)
//
//        val codingQuestion = mockk<CodingQuestion>()
//
//        //
//        every { frontmatter.codeFilename }
//        every { questionParser.parseCodingQuestion(any(), any(), any()) } returns codingQuestion
//
//        // when
//        val result = assignmentFetchService.fetchAssignment(assignment, commitHash)
//
//        // then
//        assertNotNull(result)
//        assertEquals(codingQuestion, result)
//        verify { restTemplate.getForObject(any<String>(), String::class.java) }
//    }

    @Test
    fun `should fetch assignment for MULTIPLE_CHOICE type`() {
        // variables
        val assignment = Assignment(id = 2, baseFilePath = "path/to/mcfile.md", assignmentType = AssignmentType.MULTIPLE_CHOICE)
        val commitHash = "commit123"

        val fileContent = "dummy file content"
        val frontmatter = mockk<Frontmatter>()
        val body = "dummy body"

        // given
        every { restTemplate.getForObject(any<String>(), String::class.java) } returns fileContent

        // Mock the frontmatterParser to return frontmatter and body
        every { frontmatterParser.parse(fileContent, "path/to/mcfile_qid2.md") } returns Pair(frontmatter, body)

        val multipleChoiceQuestion = mockk<MultipleChoiceQuestion>()

        // Mock the parser for MULTIPLE_CHOICE type question
        every { questionParser.parseMultipleChoiceQuestion(body, frontmatter) } returns multipleChoiceQuestion

        // when
        val result = assignmentFetchService.fetchAssignment(assignment, commitHash)

        // then
        assertNotNull(result)
        assertEquals(multipleChoiceQuestion, result)
        verify { restTemplate.getForObject(any<String>(), String::class.java) }
    }

    @Test
    fun `should fetch assignment for OPEN type`() {
        // Arrange
        val assignment = Assignment(id = 3, baseFilePath = "path/to/openfile.md", assignmentType = AssignmentType.OPEN)
        val commitHash = "commit123"

        val fileContent = "dummy file content"
        val frontmatter = mockk<OpenFrontmatter>()
        val body = "dummy body"

        // given
        every { restTemplate.getForObject(any<String>(), String::class.java) } returns fileContent
        every { frontmatterParser.parse(fileContent, "path/to/openfile_qid3.md") } returns Pair(frontmatter, body)

        val openQuestion = mockk<OpenQuestion>()

        // Mock the parser for OPEN type question
        every { questionParser.parseOpenQuestion(body, frontmatter) } returns openQuestion

        // when
        val result = assignmentFetchService.fetchAssignment(assignment, commitHash)

        // then
        assertNotNull(result)
        assertEquals(openQuestion, result)
        verify { restTemplate.getForObject(any<String>(), String::class.java) }
    }

    @Test
    fun `should throw exception when URL fetch fails`() {
        // variables
        val assignment = Assignment(id = 4, baseFilePath = "invalid/path", assignmentType = AssignmentType.CODING)
        val commitHash = "commit123"

        // given
        every { restTemplate.getForObject(any<String>(), String::class.java) } throws Exception("Couldn't access the URL")

        // when and then
        assertThrows<Exception> { assignmentFetchService.fetchAssignment(assignment, commitHash) }
    }
}