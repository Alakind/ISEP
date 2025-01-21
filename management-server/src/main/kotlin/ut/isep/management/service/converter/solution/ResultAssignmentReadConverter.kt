package ut.isep.management.service.converter.solution

import dto.assignment.*
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.service.converter.ReadConverter
import ut.isep.management.service.converter.testresult.TestResultReadConverter

@Component
class ResultAssignmentReadConverter(
    val solvedAssignmentConverter: SolvedAssignmentReadConverter,
    val testResultConverter: TestResultReadConverter
) :
    ReadConverter<SolvedAssignment, ResultAssignmentReadDTO> {

    override fun toDTO(entity: SolvedAssignment): ResultAssignmentReadDTO {
        return when (entity) {
            is SolvedAssignmentCoding -> toDTO(entity)
            is SolvedAssignmentMultipleChoice -> toDTO(entity)
            is SolvedAssignmentOpen -> toDTO(entity)
            else -> throw UnsupportedOperationException("Unsupported assignment type")
        }
    }

    private fun toDTO(entity: SolvedAssignmentCoding): ResultAssignmentCodingReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentCodingReadDTO(
            solvedAssignment = baseAssignmentDTO,
            //TODO implement this repo-side, and add common questionParser Service that can be used by solvedAssignment, Assignment, ResultAssignment converters
            // and that can pass through reference answers to be used by ResultService, but not SolvedAssignment or Assignment Service
            referenceAnswer = AnswerCreateReadDTO.Coding("placeholder reference answer"),
            scoredPoints = entity.scoredPoints,
            testResults = entity.testResults.map { testResultConverter.toDTO(it) },
        )
    }

    private fun toDTO(entity: SolvedAssignmentMultipleChoice): ResultAssignmentMultipleChoiceReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentMultipleChoiceReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.MultipleChoice(listOf(1)), //TODO() still need that Question Parser service
//            referenceAnswer = AnswerCreateReadDTO.MultipleChoice(
//                multipleChoiceAssignment.optionToSolution.entries
//                    .withIndex()
//                    .filter { (_, key) -> key.value == true }
//                    .map { it.index }),
            scoredPoints = entity.scoredPoints,
        )
    }

    private fun toDTO(entity: SolvedAssignmentOpen): ResultAssignmentOpenReadDTO {
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentOpenReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.Open("reference answer"),  //TODO() pass reference answers through repo
            scoredPoints = entity.scoredPoints,
        )
    }
}
