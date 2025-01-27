package ut.isep.management.service.converter.solution

import dto.assignment.ResultAssignmentCodingReadDTO
import dto.assignment.ResultAssignmentMultipleChoiceReadDTO
import dto.assignment.ResultAssignmentOpenReadDTO
import dto.assignment.ResultAssignmentReadDTO
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
import ut.isep.management.service.converter.testresult.TestResultReadConverter

@Component
class ResultAssignmentReadConverter(
    val solvedAssignmentConverter: SolvedAssignmentReadConverter,
    val testResultConverter: TestResultReadConverter
) {

    fun toDTO(entity: SolvedAssignment, question: Question): ResultAssignmentReadDTO {
        return when (entity) {
            is SolvedAssignmentCoding -> toCodingDTO(entity, question as CodingQuestion)
            is SolvedAssignmentMultipleChoice -> toMultipleChoiceDTO(entity, question as MultipleChoiceQuestion)
            is SolvedAssignmentOpen -> toOpenDTO(entity, question as OpenQuestion)
            else -> throw UnsupportedOperationException("Unsupported assignment type")
        }
    }

    private fun toCodingDTO(
        entity: SolvedAssignmentCoding,
        fetchedQuestion: CodingQuestion
    ): ResultAssignmentCodingReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toCodingDTO(entity, fetchedQuestion)
        return ResultAssignmentCodingReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.Coding(
                code = fetchedQuestion.files.referenceCode?.content,
                test = fetchedQuestion.files.referenceTest?.content
            ),
            scoredPoints = entity.scoredPoints,
            testResults = entity.testResults.map { testResultConverter.toDTO(it) },
        )
    }

    private fun toMultipleChoiceDTO(
        entity: SolvedAssignmentMultipleChoice,
        fetchedQuestion: MultipleChoiceQuestion
    ): ResultAssignmentMultipleChoiceReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toMultipleChoiceDTO(entity, fetchedQuestion)
        return ResultAssignmentMultipleChoiceReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.MultipleChoice(
                fetchedQuestion.options.filter { it.isCorrect }.map { it.text }),
            scoredPoints = entity.scoredPoints,
        )
    }

    private fun toOpenDTO(entity: SolvedAssignmentOpen, fetchedQuestion: OpenQuestion): ResultAssignmentOpenReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toOpenDTO(entity, fetchedQuestion)
        return ResultAssignmentOpenReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.Open(fetchedQuestion.referenceAnswer),
            scoredPoints = entity.scoredPoints,
        )
    }
}
