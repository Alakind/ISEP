package ut.isep.management.service

import dto.*
import ut.isep.management.model.entity.*

fun ApplicantCreateReadDTO.fromDTO(): Applicant {
    return Applicant(
        status = this.status,
        preferredLanguage = this.preferredLanguage
    )
}


fun SectionDTO.fromDTO(): Section {
    return Section(
        title = this.title,
        assignments = this.assignments.map { it.fromDTO() }
    )
}

fun AssignmentDTO.fromDTO(): Assignment {
    return when (this) {
        is AssignmentMultipleChoiceDTO -> this.fromDTO()
        is AssignmentCodingDTO -> this.fromDTO()
        is AssignmentOpenDTO -> this.fromDTO()
        else -> throw NotImplementedError("Cannot (yet) convert subclass ${this::class} of ${Assignment::class} from DTO")
    }
}

fun AssignmentMultipleChoiceDTO.fromDTO(): AssignmentMultipleChoice {
    return AssignmentMultipleChoice(
        description = this.description,
        isMultipleAnswers = this.isMultipleAnswers,
        options = this.options
    )
}

fun AssignmentOpenDTO.fromDTO(): AssignmentOpen {
    return AssignmentOpen(
        description = this.description
    )
}

fun AssignmentCodingDTO.fromDTO(): AssignmentCoding {
    return AssignmentCoding(
        description = this.description,
        language = this.language,
        codeUri  =  this.codeUri
    )
}
