package ut.isep.management.service

import dto.*
import ut.isep.management.model.entity.*

fun ApplicantCreateDTO.fromDTO(): Applicant {
    return Applicant(
        name = this.name,
        email = this.email,
        status = this.status,
        preferredLanguage = this.preferredLanguage
    )
}

fun UserCreateReadDTO.fromDTO(): User {
    return User(
        name = this.name,
        email = this.email,
        role = this.role
    )
}

