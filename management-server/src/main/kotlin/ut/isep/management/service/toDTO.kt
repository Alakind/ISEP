package ut.isep.management.service

import dto.*
import ut.isep.management.model.entity.*

fun Applicant.toDTO(): ApplicantCreateReadDTO {
    return ApplicantCreateReadDTO(
        id = this.id,
        status = this.status,
        preferredLanguage = this.preferredLanguage)
}

fun Assessment.toDTO(): InterviewDTO {
    return InterviewDTO(
        id = this.id,
        sections = this.sections.map {it.toDTO() }
    )
}

fun Section.toDTO(): SectionDTO {
    return SectionDTO(
        id = this.id,
        title = this.title,
        assignments = this.assignments.map { it.toDTO() }
    )
}

fun Assignment.toDTO(): AssignmentDTO {
    return when (this) {
        is AssignmentMultipleChoice -> this.toDTO()
        is AssignmentCoding -> this.toDTO()
        is AssignmentOpen -> this.toDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Assignment::class} to DTO")
    }
}

fun AssignmentMultipleChoice.toDTO(): AssignmentMultipleChoiceDTO {
    return AssignmentMultipleChoiceDTO(
        id = this.id,
        description = this.description,
        isMultipleAnswers = this.isMultipleAnswers,
        options = this.options
    )
}

fun AssignmentOpen.toDTO(): AssignmentOpenDTO {
    return AssignmentOpenDTO(
        id = this.id,
        description = this.description
    )
}

fun AssignmentCoding.toDTO(): AssignmentCodingDTO {
    return AssignmentCodingDTO(
        id = this.id,
        description = this.description,
        language = this.language,
        codeUri = this.codeUri // Replace with actual fetching of the files
    )
}
