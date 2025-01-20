package ut.isep.management.service.converter.assignment


import dto.assignment.AssignmentCodingReadDTO
import dto.assignment.AssignmentMultipleChoiceReadDTO
import dto.assignment.AssignmentOpenReadDTO
import dto.assignment.AssignmentReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.AssignmentCoding
import ut.isep.management.model.entity.AssignmentMultipleChoice
import ut.isep.management.model.entity.AssignmentOpen
import ut.isep.management.service.converter.ReadConverter

@Component
class AssignmentReadConverter : ReadConverter<Assignment, AssignmentReadDTO> {

    override fun toDTO(entity: Assignment): AssignmentReadDTO {
        return when (entity) {
            is AssignmentMultipleChoice -> toDTO(entity)
            is AssignmentCoding -> toDTO(entity)
            is AssignmentOpen -> toDTO(entity)
            else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Assignment::class} to DTO")
        }
    }

    fun toDTO(entity: AssignmentMultipleChoice): AssignmentMultipleChoiceReadDTO {
        return AssignmentMultipleChoiceReadDTO(
            id = entity.id,
            description = entity.description!!,
            isMultipleAnswers = entity.optionToSolution.values.count { it } > 1,
            options = entity.optionToSolution.keys.toList(),
            availablePoints = entity.availablePoints!!,
            availableSeconds = entity.availableSeconds!!,
        )
    }

    fun toDTO(entity: AssignmentOpen): AssignmentOpenReadDTO {
        return AssignmentOpenReadDTO(
            id = entity.id,
            description = entity.description!!,
            availablePoints = entity.availablePoints!!,
            availableSeconds = entity.availableSeconds!!,
        )
    }

    fun toDTO(entity: AssignmentCoding): AssignmentCodingReadDTO {
        return AssignmentCodingReadDTO(
            id = entity.id,
            description = entity.description!!,
            language = entity.language!!,
            codeUri = entity.codeUri!!, // Replace with actual fetching of the files
            availablePoints = entity.availablePoints!!,
            availableSeconds = entity.availableSeconds!!,
            startCode = entity.startingCode
        )
    }
}
