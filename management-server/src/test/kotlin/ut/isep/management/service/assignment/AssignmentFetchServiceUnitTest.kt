package ut.isep.management.service.assignment

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.web.reactive.function.client.WebClient
import parser.*
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import parser.question.OpenQuestion
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType

class AssignmentFetchServiceUnitTest {

    private lateinit var webClient: WebClient

    private lateinit var questionParser: QuestionParser
    private lateinit var frontmatterParser: FrontmatterParser

    private lateinit var service: AsyncAssignmentFetchService

    @BeforeEach
    fun setUp() {
        webClient = mockk()

        questionParser = mockk()
        frontmatterParser = mockk()

        service = AsyncAssignmentFetchService(webClient)
        service.parser = questionParser
        service.frontmatterParser = frontmatterParser
    }

    @Test
    fun `fetchAssignment should return MultipleChoiceQuestion for MULTIPLE_CHOICE assignment`() {
        // Arrange
        val assignment = Assignment(
            id = 1,
            assignmentType = AssignmentType.MULTIPLE_CHOICE,
            baseFilePath = "path/to/assignment.md"
        )
        val commitHash = "abc123"
        val url = "/$commitHash/${assignment.filePathWithId}"
        val fileContent = "file content"
        val frontmatter = mockk<Frontmatter>()
        val multipleChoiceQuestion = mockk<MultipleChoiceQuestion>()

        every { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) } returns Mono.just(fileContent)

        every { frontmatterParser.parse(fileContent, assignment.filePathWithId) } returns Pair(frontmatter, "body")
        every { questionParser.parseMultipleChoiceQuestion("body", frontmatter) } returns multipleChoiceQuestion

        // Act
        val result = service.fetchAssignment(assignment, commitHash)

        // Assert
        StepVerifier.create(result)
            .expectNext(multipleChoiceQuestion)
            .verifyComplete()

        verify { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) }
        verify { frontmatterParser.parse(fileContent, assignment.filePathWithId) }
        verify { questionParser.parseMultipleChoiceQuestion("body", frontmatter) }
    }

    @Test
    fun `fetchAssignment should return OpenQuestion for OPEN assignment`() {
        // Arrange
        val assignment = Assignment(
            id = 2,
            assignmentType = AssignmentType.OPEN,
            baseFilePath = "path/to/assignment.md"
        )
        val commitHash = "abc123"
        val url = "/$commitHash/${assignment.filePathWithId}"
        val fileContent = "file content"
        val frontmatter = mockk<OpenFrontmatter>()
        val openQuestion = mockk<OpenQuestion>()

        every { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) } returns Mono.just(fileContent)

        every { frontmatterParser.parse(fileContent, assignment.filePathWithId) } returns Pair(frontmatter, "body")
        every { questionParser.parseOpenQuestion("body", frontmatter) } returns openQuestion

        // Act
        val result = service.fetchAssignment(assignment, commitHash)

        // Assert
        StepVerifier.create(result)
            .expectNext(openQuestion)
            .verifyComplete()

        verify { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) }
        verify { frontmatterParser.parse(fileContent, assignment.filePathWithId) }
        verify { questionParser.parseOpenQuestion("body", frontmatter) }
    }

    @Test
    fun `fetchAssignment should return CodingQuestion for CODING assignment`() {
        // Arrange
        val assignment = Assignment(
            id = 3,
            assignmentType = AssignmentType.CODING,
            baseFilePath = "path/to/assignment.md"
        )
        val commitHash = "abc123"
        val url = "/$commitHash/${assignment.filePathWithId}"
        val fileContent = "file content"
        val frontmatter = mockk<CodingFrontmatter>(relaxed = true)
        val codingQuestion = mockk<CodingQuestion>()

        // Fix: Mock the originalFilePath property explicitly
        every { frontmatter.originalFilePath } returns assignment.filePathWithId
        every { frontmatter.codeFilename } returns "Main.java"
        every { frontmatter.testFilename } returns "MainTest.java"
        every { frontmatter.secretTestFilename } returns "SecretTest.java"
        every { frontmatter.referenceCodeFilename } returns null
        every { frontmatter.referenceTestFilename } returns null

        every { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) } returns Mono.just(fileContent)

        every { frontmatterParser.parse(fileContent, assignment.filePathWithId) } returns Pair(frontmatter, "body")

        val parentDirPath = "path/to"
        val parentURL = "/$commitHash/$parentDirPath/"
        val codeFileContent = "code file content"
        val testFileContent = "test file content"
        val secretTestFileContent = "secret test file content"
        val codeUrl = "$parentURL${frontmatter.codeFilename}"
        val testUrl = "$parentURL${frontmatter.testFilename}"
        val secretTestUrl = "$parentURL${frontmatter.secretTestFilename}"

        every { webClient.get().uri(codeUrl).retrieve().bodyToMono(String::class.java) } returns Mono.just(
            codeFileContent
        )
        every { webClient.get().uri(testUrl).retrieve().bodyToMono(String::class.java) } returns Mono.just(
            testFileContent
        )
        every { webClient.get().uri(secretTestUrl).retrieve().bodyToMono(String::class.java) } returns Mono.just(
            secretTestFileContent
        )

        every { questionParser.parseCodingQuestion(any(), "body", frontmatter) } returns codingQuestion

        // Act
        val result = service.fetchAssignment(assignment, commitHash)

        // Assert
        StepVerifier.create(result)
            .expectNext(codingQuestion)
            .verifyComplete()

        verify { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) }
        verify { frontmatterParser.parse(fileContent, assignment.filePathWithId) }
        verify { questionParser.parseCodingQuestion(any(), "body", frontmatter) }
    }

    @Test
    fun `fetchAssignment should propagate errors when fetching files`() {
        // Arrange
        val assignment = Assignment(
            id = 4,
            assignmentType = AssignmentType.CODING,
            baseFilePath = "path/to/assignment.md"
        )
        val commitHash = "abc123"
        val url = "/$commitHash/${assignment.filePathWithId}"

        println("Expected URL: $url")  // Debugging

        every {
            webClient.get().uri(url).retrieve().bodyToMono(String::class.java)
        } returns Mono.error(RuntimeException("Failed to fetch file"))

        // Act
        val result = service.fetchAssignment(assignment, commitHash)

        // Assert
        StepVerifier.create(result)
            .expectError(RuntimeException::class.java)
            .verify()

        verify { webClient.get().uri(url).retrieve().bodyToMono(String::class.java) }
    }
}