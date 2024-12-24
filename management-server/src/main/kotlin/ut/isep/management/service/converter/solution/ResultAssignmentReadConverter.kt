package ut.isep.management.service.converter.solution

import dto.assignment.ResultAssignmentCodingReadDTO
import dto.assignment.ResultAssignmentMultipleChoiceReadDTO
import dto.assignment.ResultAssignmentOpenReadDTO
import dto.assignment.ResultAssignmentReadDTO
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.service.converter.ReadConverter

@Component
class ResultAssignmentReadConverter(val solvedAssignmentConverter: SolvedAssignmentReadConverter) :
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
        val codingAssignment = entity.assignment as? AssignmentCoding
            ?: throw IllegalStateException("SolvedAssignmentCoding ${entity.id} has an assignment field that is null")
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentCodingReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.Coding(codingAssignment.referenceAnswer!!),
            scoredPoints = entity.scoredPoints
        )
    }

    private fun toDTO(entity: SolvedAssignmentMultipleChoice): ResultAssignmentMultipleChoiceReadDTO {
        val multipleChoiceAssignment = entity.assignment as? AssignmentMultipleChoice
            ?: throw IllegalStateException("SolvedAssignmentMultipleChoice ${entity.id} has an assignment field that is null")
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentMultipleChoiceReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.MultipleChoice(
                multipleChoiceAssignment.optionToSolution.entries
                    .withIndex()
                    .filter { (_, key) -> key.value == true }
                    .map { it.index }),
            scoredPoints = entity.scoredPoints
        )
    }

    private fun toDTO(entity: SolvedAssignmentOpen): ResultAssignmentOpenReadDTO {
        val openAssignment = entity.assignment as? AssignmentOpen
            ?: throw IllegalStateException("SolvedAssignmentOpen ${entity.id} has an assignment field that is null")
        val baseAssignmentDTO = solvedAssignmentConverter.toDTO(entity)
        return ResultAssignmentOpenReadDTO(
            solvedAssignment = baseAssignmentDTO,
            referenceAnswer = AnswerCreateReadDTO.Open(openAssignment.referenceAnswer!!),
            scoredPoints = entity.scoredPoints
        )
    }
}
