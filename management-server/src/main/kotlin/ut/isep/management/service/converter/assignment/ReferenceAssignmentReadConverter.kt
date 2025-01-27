package ut.isep.management.service.converter.assignment


import dto.assignment.ReferenceAssignmentCodingReadDTO
import dto.assignment.ReferenceAssignmentMultipleChoiceReadDTO
import dto.assignment.ReferenceAssignmentOpenReadDTO
import dto.assignment.ReferenceAssignmentReadDTO
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import parser.question.CodingQuestion
import parser.question.MultipleChoiceQuestion
import parser.question.OpenQuestion
import parser.question.Question

@Component
class ReferenceAssignmentReadConverter() {
    fun toDTO(question: Question): ReferenceAssignmentReadDTO {
        return when (question) {
            is CodingQuestion -> toCodingDTO(question)
            is MultipleChoiceQuestion -> toMultipleChoiceDTO(question)
            is OpenQuestion -> toOpenDTO(question)
        }
    }

    fun toMultipleChoiceDTO(
        question: MultipleChoiceQuestion
    ): ReferenceAssignmentMultipleChoiceReadDTO {
        return ReferenceAssignmentMultipleChoiceReadDTO(
            id = question.id!!,
            description = question.description,
            availablePoints = question.availablePoints,
            availableSeconds = question.availableSeconds,
            options = question.options.map { it.text },
            referenceAnswer = AnswerCreateReadDTO.MultipleChoice(question.options.filter { it.isCorrect }
                .map { it.text })
        )
    }

    fun toOpenDTO(question: OpenQuestion): ReferenceAssignmentOpenReadDTO {
        return ReferenceAssignmentOpenReadDTO(
            id = question.id!!,
            description = question.description,
            availablePoints = question.availablePoints,
            availableSeconds = question.availableSeconds,
            referenceAnswer = AnswerCreateReadDTO.Open(question.referenceAnswer ?: "")
        )
    }

    fun toCodingDTO(question: CodingQuestion): ReferenceAssignmentCodingReadDTO {
        return ReferenceAssignmentCodingReadDTO(
            id = question.id!!,
            description = question.description,
            availablePoints = question.availablePoints,
            availableSeconds = question.availableSeconds,
            language = question.language,
            code = question.files.code.content,
            test = question.files.test.content,
            secretTest = question.files.secretTest.content,
            referenceAnswer = AnswerCreateReadDTO.Coding(
                code = question.files.referenceCode?.content ?: "",
                test = question.files.referenceTest?.content ?: ""
            )
        )
    }
}
