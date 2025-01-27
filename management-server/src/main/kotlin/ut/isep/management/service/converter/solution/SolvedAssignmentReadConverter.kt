package ut.isep.management.service.converter.solution

import dto.assignment.*
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import parser.question.OpenQuestion
import parser.question.Question
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentCoding
import ut.isep.management.model.entity.SolvedAssignmentMultipleChoice
import ut.isep.management.model.entity.SolvedAssignmentOpen
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter

@Component
class SolvedAssignmentReadConverter(val assignmentReadConverter: ReferenceAssignmentReadConverter
) {
    fun toDTO(entity: SolvedAssignment, question: Question): SolvedAssignmentReadDTO {
        return when (entity) {
            is SolvedAssignmentCoding -> toCodingDTO(entity, question as CodingQuestion)
            is SolvedAssignmentMultipleChoice -> toMultipleChoiceDTO(entity, question as MultipleChoiceQuestion)
            is SolvedAssignmentOpen -> toOpenDTO(entity, question as OpenQuestion)
            else -> throw UnsupportedOperationException("Unsupported assignment type")
        }
    }

    fun toCodingDTO(entity: SolvedAssignmentCoding, question: CodingQuestion): SolvedAssignmentCodingReadDTO {
        return SolvedAssignmentCodingReadDTO(
            id = question.id!!,
            description = question.description,
            language = question.language,
            startCode = question.files.code.content,
            startTest = question.files.test.content,
            answer = AnswerCreateReadDTO.Coding(entity.userCode, entity.testCode)
        )
    }

    fun toMultipleChoiceDTO(
        entity: SolvedAssignmentMultipleChoice,
        question: MultipleChoiceQuestion
    ): SolvedAssignmentMultipleChoiceReadDTO {
        return SolvedAssignmentMultipleChoiceReadDTO(
            id = question.id!!,
            description = question.description,
            isMultipleAnswers = question.options.count {it.isCorrect} > 1,
            options = question.options.map {it.text},
            answer = AnswerCreateReadDTO.MultipleChoice(entity.userOptionsMarkedCorrect)
        )
    }

    fun toOpenDTO(entity: SolvedAssignmentOpen,
                  question: OpenQuestion
    ): SolvedAssignmentOpenReadDTO {
        return SolvedAssignmentOpenReadDTO(
            id = question.id!!,
            description = question.description,
            answer = AnswerCreateReadDTO.Open(entity.userSolution)
        )
    }
}
