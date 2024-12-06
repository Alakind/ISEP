package ut.isep.management.service

import dto.*
import ut.isep.management.model.entity.*

fun ApplicantCreateDTO.fromDTO(): Applicant {
    return Applicant(
        name = this.name,
        status = this.status,
        preferredLanguage = this.preferredLanguage
    )
}
