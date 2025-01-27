package ut.isep.management.service.converter.solution

import dto.assignment.SolvedAssignmentCodingReadDTO
import dto.assignment.SolvedAssignmentMultipleChoiceReadDTO
import dto.assignment.SolvedAssignmentOpenReadDTO
import dto.assignment.SolvedAssignmentReadDTO
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.*
import ut.isep.management.service.converter.ReadConverter
import ut.isep.management.service.converter.assignment.AssignmentReadConverter

@Component
class SolvedAssignmentReadConverter(val unsolvedAssignmentConverter: AssignmentReadConverter) :
    ReadConverter<SolvedAssignment, SolvedAssignmentReadDTO> {

    override fun toDTO(entity: SolvedAssignment): SolvedAssignmentReadDTO {
        return when (entity) {
            is SolvedAssignmentCoding -> toDTO(entity)
            is SolvedAssignmentMultipleChoice -> toDTO(entity)
            is SolvedAssignmentOpen -> toDTO(entity)
            else -> throw UnsupportedOperationException("Unsupported assignment type")
        }
    }

    fun toDTO(entity: SolvedAssignmentCoding): SolvedAssignmentCodingReadDTO {
        val codingAssignment = entity.assignment as? AssignmentCoding
            ?: throw IllegalStateException("SolvedAssignmentCoding ${entity.id} has an assignment field that is null")
        val unsolvedAssignment = unsolvedAssignmentConverter.toDTO(codingAssignment)
        return SolvedAssignmentCodingReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.Coding(entity.userCode, entity.testCode)
        )
    }

    fun toDTO(entity: SolvedAssignmentMultipleChoice): SolvedAssignmentMultipleChoiceReadDTO {
        val multipleChoiceAssignment = entity.assignment as? AssignmentMultipleChoice
            ?: throw IllegalStateException("SolvedAssignmentMultipleChoice ${entity.id} has an assignment field that is null")
        val unsolvedAssignment = unsolvedAssignmentConverter.toDTO(multipleChoiceAssignment)
        return SolvedAssignmentMultipleChoiceReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.MultipleChoice(entity.userOptionsMarkedCorrect)
        )
    }

    fun toDTO(entity: SolvedAssignmentOpen): SolvedAssignmentOpenReadDTO {
        val openAssignment = entity.assignment as? AssignmentOpen
            ?: throw IllegalStateException("SolvedAssignmentOpen ${entity.id} has an assignment field that is null")
        val unsolvedAssignment = unsolvedAssignmentConverter.toDTO(openAssignment)
        return SolvedAssignmentOpenReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.Open(entity.userSolution)
        )
    }
}
