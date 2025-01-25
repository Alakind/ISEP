package ut.isep.management.service.converter.assignment


import dto.assignment.AssignmentCodingReadDTO
import dto.assignment.AssignmentMultipleChoiceReadDTO
import dto.assignment.AssignmentOpenReadDTO
import dto.assignment.AssignmentReadDTO
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import parser.Frontmatter
import parser.FrontmatterParser
import parser.QuestionParser
import parser.question.CodingFile
import ut.isep.management.model.entity.*
import ut.isep.management.util.logger
import java.net.URI
import java.nio.file.Paths

@Component
class AssignmentReadConverter(val restTemplate: RestTemplate) {
    val parser = QuestionParser()
    val frontmatterParser = FrontmatterParser()
    val logger = logger()
    val gitHubBaseURL = "https://raw.githubusercontent.com/eefscheef/ISEP-questions"

    fun fetchFile(url: String): String {
        logger.info("Sending HTTP request to url: $url")
        return restTemplate.getForObject(url, String::class.java)
            ?: throw Exception("Couldn't access the URL $url")
    }

    fun toDTO(entity: Assignment, commitHash: String): AssignmentReadDTO {
        logger.info("accessing assignment ${entity.id}")
        val url = "$gitHubBaseURL/$commitHash/${entity.filePathWithId}"

        val fetchedFileContent: String = fetchFile(url)
        val (frontmatter, body) = frontmatterParser.parse(fetchedFileContent, entity.filePathWithId)
        return when (entity.assignmentType!!) {
            AssignmentType.CODING -> toCodingDTO(entity, frontmatter, body, commitHash)
            AssignmentType.MULTIPLE_CHOICE -> toMultipleChoiceDTO(entity, frontmatter, body)
            AssignmentType.OPEN -> toOpenDTO(entity, frontmatter, body)
        }
    }

    fun toMultipleChoiceDTO(
        entity: Assignment,
        frontmatter: Frontmatter,
        body: String
    ): AssignmentMultipleChoiceReadDTO {
        val parsedQuestion = parser.parseMultipleChoiceQuestion(body, frontmatter)
        return AssignmentMultipleChoiceReadDTO(
            id = entity.id,
            description = parsedQuestion.description,
            isMultipleAnswers = parsedQuestion.options.count { it.isCorrect } > 1,
            options = parsedQuestion.options.map { it.text },
            availablePoints = frontmatter.availablePoints,
            availableSeconds = frontmatter.availableSeconds
        )
    }

    fun toOpenDTO(entity: Assignment, frontmatter: Frontmatter, body: String): AssignmentOpenReadDTO {
        val parsedQuestion = parser.parseOpenQuestion(body, frontmatter)
        return AssignmentOpenReadDTO(
            id = entity.id,
            description = parsedQuestion.description,
            availablePoints = frontmatter.availablePoints,
            availableSeconds = frontmatter.availableSeconds,
        )
    }

    fun toCodingDTO(entity: Assignment, frontmatter: Frontmatter, body: String, commitHash: String): AssignmentCodingReadDTO {
        val parentDirPath = Paths.get(entity.filePathWithId).parent?.toString()
            ?: throw IllegalStateException("All assignment files should have parent directories")
        val parentURL = "$gitHubBaseURL/$commitHash/$parentDirPath/"
        val codeFile = CodingFile(frontmatter.codeFilename!!, fetchFile(parentURL + frontmatter.codeFilename!!))
        val testFile = CodingFile(frontmatter.testFilename!!, fetchFile(parentURL + frontmatter.testFilename!!))
        val secretTestFile = CodingFile(frontmatter.secretTestFilename!!, fetchFile(parentURL + frontmatter.secretTestFilename!!))

        val parsedQuestion = parser.parseCodingQuestion(codeFile, testFile, secretTestFile, body, frontmatter)
        return AssignmentCodingReadDTO(
            id = entity.id,
            description = parsedQuestion.description,
            language = frontmatter.language!!,
            codeUri = URI(""),
            availablePoints = frontmatter.availablePoints,
            availableSeconds = frontmatter.availableSeconds,
            startCode = parsedQuestion.code.code
        )
    }
}
