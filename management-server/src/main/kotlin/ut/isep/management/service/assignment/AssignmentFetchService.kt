package ut.isep.management.service.assignment



import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import parser.*
import parser.question.*
import ut.isep.management.model.entity.*
import ut.isep.management.util.logger
import java.nio.file.Paths

@Service
class AssignmentFetchService(@Qualifier("githubRestTemplate") val restTemplate: RestTemplate) {
    val parser = QuestionParser()
    val frontmatterParser = FrontmatterParser()
    val logger = logger()
    val gitHubBaseURL = "https://raw.githubusercontent.com/eefscheef/ISEP-questions-demo"

    private fun fetchFile(url: String): String {
        logger.info("Sending HTTP request to url: $url")
        return restTemplate.getForObject(url, String::class.java)
            ?: throw Exception("Couldn't access the URL $url")
    }

    fun fetchAssignment(entity: Assignment, commitHash: String): Question {
        logger.info("accessing assignment ${entity.id}")
        val url = "$gitHubBaseURL/$commitHash/${entity.filePathWithId}"

        val fetchedFileContent: String = fetchFile(url)
        val (frontmatter, body) = frontmatterParser.parse(fetchedFileContent, entity.filePathWithId)
        return when (entity.assignmentType!!) {
            AssignmentType.CODING -> toCodingQuestion(entity, frontmatter as CodingFrontmatter, body, commitHash)
            AssignmentType.MULTIPLE_CHOICE -> toMultipleChoiceQuestion(entity, frontmatter, body)
            AssignmentType.OPEN -> toOpenQuestion(entity, frontmatter as OpenFrontmatter, body)
        }
    }

    fun toMultipleChoiceQuestion(
        entity: Assignment,
        frontmatter: Frontmatter,
        body: String
    ): MultipleChoiceQuestion {
        return parser.parseMultipleChoiceQuestion(body, frontmatter)
    }

    fun toOpenQuestion(entity: Assignment, frontmatter: OpenFrontmatter, body: String): OpenQuestion {
        return parser.parseOpenQuestion(body, frontmatter)
    }

    fun toCodingQuestion(entity: Assignment, frontmatter: CodingFrontmatter, body: String, commitHash: String): CodingQuestion {
        val parentDirPath = Paths.get(entity.filePathWithId).parent?.toString()
            ?: throw IllegalStateException("All assignment files should have parent directories")
        val parentURL = "$gitHubBaseURL/$commitHash/$parentDirPath/"
        val codeFile = CodingFile(frontmatter.codeFilename, fetchFile(parentURL + frontmatter.codeFilename))
        val testFile = CodingFile(frontmatter.testFilename, fetchFile(parentURL + frontmatter.testFilename))
        val secretTestFile = CodingFile(frontmatter.secretTestFilename, fetchFile(parentURL + frontmatter.secretTestFilename))
        val referenceCode = frontmatter.referenceCodeFilename?.let {referenceFile -> CodingFile(referenceFile, fetchFile(parentURL + referenceFile))}
        val referenceTest = frontmatter.referenceTestFilename?.let {referenceFile -> CodingFile(referenceFile, fetchFile(parentURL + referenceFile))}
        val codingFiles = CodeQuestionFiles(codeFile, testFile, secretTestFile, referenceCode, referenceTest)
        return parser.parseCodingQuestion(codingFiles, body, frontmatter)
    }
}
