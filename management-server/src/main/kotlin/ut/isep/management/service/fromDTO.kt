package ut.isep.management.service

import dto.*
import ut.isep.management.model.pgsql.*
import java.net.URI

fun ApplicantDTO.fromDTO(): Applicant {
    return Applicant(
        status = this.status,
        preferredLanguage = this.preferredLanguage
    )
}

fun InterviewDTO.fromDTO(): Interview {
    return Interview(
        sections = this.sections.map {it.fromDTO() }
    )
}

fun SectionDTO.fromDTO(): Section {
    return Section(
        title = this.title,
        assignments = this.assignments.map { it.fromDTO() }.toSet()
    )
}

fun AssignmentDTO.fromDTO(): Assignment {
    return when (this) {
        is AssignmentMultipleChoiceDTO -> this.fromDTO()
        is AssignmentCodingDTO -> this.fromDTO()
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
