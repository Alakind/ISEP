package ut.isep.management.service.assignment

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import parser.*
import parser.question.*
import reactor.core.publisher.Mono
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentType
import ut.isep.management.util.logger
import java.nio.file.Paths

@Service
class AsyncAssignmentFetchService(@Qualifier("githubWebClient") val webClient: WebClient) {
    var parser = QuestionParser()
    var frontmatterParser = FrontmatterParser()
    val logger = logger()

    private fun fetchFile(url: String): Mono<String> {
        logger.info("Sending HTTP request to url: $url")
        return webClient.get()
            .uri(url)
            .retrieve()
            .bodyToMono(String::class.java)
            .onErrorResume { throwable ->
                Mono.error(Exception("Couldn't access the URL $url", throwable))
            }
    }

    fun fetchAssignment(entity: Assignment, commitHash: String): Mono<Question> {
        logger.info("accessing assignment ${entity.id}")
        val url = "/$commitHash/${entity.filePathWithId}"

        return fetchFile(url).flatMap { fetchedFileContent ->
            val (frontmatter, body) = frontmatterParser.parse(fetchedFileContent, entity.filePathWithId)
            when (entity.assignmentType!!) {
                AssignmentType.CODING -> toCodingQuestion(frontmatter as CodingFrontmatter, body, commitHash)
                AssignmentType.MULTIPLE_CHOICE -> toMultipleChoiceQuestion(frontmatter, body)
                AssignmentType.OPEN -> toOpenQuestion(frontmatter as OpenFrontmatter, body)
            }
        }
    }

    private fun toMultipleChoiceQuestion(
        frontmatter: Frontmatter,
        body: String
    ): Mono<MultipleChoiceQuestion> {
        return Mono.just(parser.parseMultipleChoiceQuestion(body, frontmatter))
    }

    private fun toOpenQuestion(frontmatter: OpenFrontmatter, body: String): Mono<OpenQuestion> {
        return Mono.just(parser.parseOpenQuestion(body, frontmatter))
    }

    private fun toCodingQuestion(frontmatter: CodingFrontmatter, body: String, commitHash: String): Mono<CodingQuestion> {
        val parentDirPath = Paths.get(frontmatter.originalFilePath).parent?.toString()
            ?: return Mono.error(IllegalStateException("All assignment files should have parent directories"))
        val parentDirPathSanitized = parentDirPath.replace("\\", "/")
        val parentURL = "/$commitHash/$parentDirPathSanitized/"

        return Mono.zip(
            fetchFile("$parentURL${frontmatter.codeFilename}"),
            fetchFile("$parentURL${frontmatter.testFilename}"),
            fetchFile("$parentURL${frontmatter.secretTestFilename}"),
            frontmatter.referenceCodeFilename?.let { fetchFile("$parentURL$it") } ?: Mono.empty(),
            frontmatter.referenceTestFilename?.let { fetchFile("$parentURL$it") } ?: Mono.empty()
        ).map { tuple ->
            val codeFile = CodingFile(frontmatter.codeFilename, tuple.t1)
            val testFile = CodingFile(frontmatter.testFilename, tuple.t2)
            val secretTestFile = CodingFile(frontmatter.secretTestFilename, tuple.t3)

            val referenceCode = frontmatter.referenceCodeFilename?.let { CodingFile(it, tuple.t4) }
            val referenceTest = frontmatter.referenceTestFilename?.let { CodingFile(it, tuple.t5) }

            val codingFiles = CodeQuestionFiles(codeFile, testFile, secretTestFile, referenceCode, referenceTest)
            parser.parseCodingQuestion(codingFiles, body, frontmatter)
        }
    }
}
