package ut.isep.management.service.converter.solution

import dto.assignment.*
import dto.solution.AnswerCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentCoding
import ut.isep.management.model.entity.SolvedAssignmentMultipleChoice
import ut.isep.management.model.entity.SolvedAssignmentOpen
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
        val codingAssignment = entity.assignment!!
        val unsolvedAssignment = unsolvedAssignmentConverter.toDTO(
            codingAssignment,
            entity.invite!!.assessment!!.gitCommitHash!!
        ) as AssignmentCodingReadDTO
        return SolvedAssignmentCodingReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.Coding(entity.userCode)
        )
    }

    fun toDTO(entity: SolvedAssignmentMultipleChoice): SolvedAssignmentMultipleChoiceReadDTO {
        val multipleChoiceAssignment = entity.assignment!!
        val unsolvedAssignment =
            unsolvedAssignmentConverter.toDTO(
                multipleChoiceAssignment,
                entity.invite!!.assessment!!.gitCommitHash!!
            ) as AssignmentMultipleChoiceReadDTO
        return SolvedAssignmentMultipleChoiceReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.MultipleChoice(entity.userOptionsMarkedCorrect)
        )
    }

    fun toDTO(entity: SolvedAssignmentOpen): SolvedAssignmentOpenReadDTO {
        val openAssignment = entity.assignment!!
        val unsolvedAssignment = unsolvedAssignmentConverter.toDTO(
            openAssignment,
            entity.invite!!.assessment!!.gitCommitHash!!
        ) as AssignmentOpenReadDTO
        return SolvedAssignmentOpenReadDTO(
            unsolvedAssignment = unsolvedAssignment,
            answer = AnswerCreateReadDTO.Open(entity.userSolution)
        )
    }
}
