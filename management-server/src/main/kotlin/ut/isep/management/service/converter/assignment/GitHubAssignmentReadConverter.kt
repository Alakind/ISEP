package ut.isep.management.service.converter.assignment


import dto.assignment.AssignmentMultipleChoiceReadDTO
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import question.MultipleChoiceQuestion
import ut.isep.management.model.entity.*
import ut.isep.management.service.assignment.QuestionParser
import ut.isep.management.service.converter.ReadConverter

@Component
class GitHubAssignmentReadConverter(val parser: QuestionParser, val restTemplate: RestTemplate) : ReadConverter<GitHubAssignmentMultipleChoice, AssignmentMultipleChoiceReadDTO> {

    override fun toDTO(entity: GitHubAssignmentMultipleChoice): AssignmentMultipleChoiceReadDTO {
        val response = restTemplate.getForObject(entity.url, String::class.java) ?: throw EntityNotFoundException("Couldn't access the URL ${entity.url}")
        val parsedQuestion: MultipleChoiceQuestion = parser.parseQuestion(response) as MultipleChoiceQuestion
        return toDTO(parsedQuestion)
    }

    fun toDTO(question: MultipleChoiceQuestion): AssignmentMultipleChoiceReadDTO {
        return AssignmentMultipleChoiceReadDTO(
            id = 1,
            description = question.description,
            options = question.options.map {it.text},
            isMultipleAnswers = question.options.count {it.isCorrect} > 1)
    }
}
