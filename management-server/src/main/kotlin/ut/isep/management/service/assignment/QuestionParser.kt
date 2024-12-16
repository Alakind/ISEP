package ut.isep.management.service.assignment

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Component
import question.*

@Component
class QuestionParser {
    val config = Config(tagOptions = listOf("Backend Developer"), questionOptions = listOf("multiple-choice"))

    data class Frontmatter @JsonCreator constructor(
        @JsonProperty("id") val id: String?,
        @JsonProperty("type") val type: String,
        @JsonProperty("tags") val tags: List<String>
    )

    private val objectMapper = ObjectMapper(YAMLFactory())

    fun parseQuestion(input: String): Question {
        // Split the input into frontmatter and body sections
        val parts = input.split("---").map { it.trim() }.filter { it.isNotEmpty() }

        // Ensure we have both frontmatter and body
        require(parts.size == 2) { "Invalid question format. Must contain frontmatter and body." }

        val frontmatter = parts[0]
        val body = parts[1]

        // Parse the frontmatter using Jackson
        val metadata: Frontmatter = objectMapper.readValue(frontmatter)
        metadata.tags.forEach { tag ->
            require(tag in config.tagOptions) {"Invalid tag provided: $tag is not present in config file"}
        }
        val type: QuestionType = QuestionType.fromString(metadata.type)
        return when (type) {
            QuestionType.MULTIPLE_CHOICE -> parseMultipleChoiceQuestion(body, metadata)
            QuestionType.OPEN -> parseOpenQuestion(body, metadata)
        }
    }

    fun parseMultipleChoiceQuestion(body: String, metadata: Frontmatter): MultipleChoiceQuestion {
        val descriptionRegex = """^(.*?)(?=\n- |\$)""".toRegex(RegexOption.DOT_MATCHES_ALL)
        val optionsRegex = """-\s*\[([xX ])]\s*(.*?)\s*$""".toRegex(RegexOption.MULTILINE)

        // Extract description using regex and default to an empty string if not found
        val description = descriptionRegex.find(body)?.groupValues?.getOrNull(1)?.trim().orEmpty()

        // Extract options from the body
        val options = optionsRegex.findAll(body).map { matchResult ->
            val (isChecked, text) = matchResult.destructured
            MultipleChoiceQuestion.Option(
                text = text.trim(),
                isCorrect = isChecked.equals("x", ignoreCase = true)
            )
        }.toList()

        // Return the parsed question
        return MultipleChoiceQuestion(
            id = metadata.id,
            tags = metadata.tags,
            description = description,
            options = options
        )
    }

    fun parseOpenQuestion(body: String, metadata: Frontmatter): OpenQuestion {
        return OpenQuestion(
            id = metadata.id,
            tags = metadata.tags,
            description = body, // Open questions have only description in their body
        )
    }
}
