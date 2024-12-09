package ut.isep.management.service.converter.solution

import dto.assignment.*
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.service.converter.ReadConverter

@Component
class SolvedAssignmentReadConverter : ReadConverter<SolvedAssignment, SolvedAssignmentReadDTO> {

    override fun toDTO(entity: SolvedAssignment): SolvedAssignmentReadDTO {
        return when (entity) {
            is SolvedAssignmentCoding -> toDTO(entity)
            is SolvedAssignmentMultipleChoice -> toDTO(entity)
            is SolvedAssignmentOpen -> toDTO(entity)
            else -> throw UnsupportedOperationException("Unsupported assignment type")
        }
    }

    private fun toDTO(entity: SolvedAssignmentCoding): SolvedAssignmentCodingReadDTO {
        val codingAssignment = entity.assignment as? AssignmentCoding
            ?: throw IllegalStateException("SolvedAssignmentCoding ${entity.id} has an assignment field that is null")

        return SolvedAssignmentCodingReadDTO(
            id = codingAssignment.id,
            type = AssignmentReadDTO.AssignmentType.Coding,
            description = codingAssignment.description,
            codeUri = codingAssignment.codeUri,
            language = codingAssignment.language,
            answer = AnswerCreateReadDTO.Coding(entity.userCode)
        )
    }

    private fun toDTO(entity: SolvedAssignmentMultipleChoice): SolvedAssignmentMultipleChoiceReadDTO {
        val multipleChoiceAssignment = entity.assignment as? AssignmentMultipleChoice
            ?: throw IllegalStateException("SolvedAssignmentMultipleChoice ${entity.id} has an assignment field that is null")

        return SolvedAssignmentMultipleChoiceReadDTO(
            id = multipleChoiceAssignment.id,
            type = AssignmentReadDTO.AssignmentType.MultipleChoice,
            description = multipleChoiceAssignment.description,
            options = multipleChoiceAssignment.optionToSolution.keys.toList(),
            isMultipleAnswers = multipleChoiceAssignment.optionToSolution.values.count{ it } > 1,
            answer = AnswerCreateReadDTO.MultipleChoice(entity.userOptionsMarkedCorrect)
        )
    }

    private fun toDTO(entity: SolvedAssignmentOpen): SolvedAssignmentOpenReadDTO {
        val openAssignment = entity.assignment as? AssignmentOpen
            ?: throw IllegalStateException("SolvedAssignmentOpen ${entity.id} has an assignment field that is null")

        return SolvedAssignmentOpenReadDTO(
            id = openAssignment.id,
            type = AssignmentReadDTO.AssignmentType.Open,
            description = openAssignment.description,
            answer = AnswerCreateReadDTO.Open(entity.userSolution)
        )
    }
}