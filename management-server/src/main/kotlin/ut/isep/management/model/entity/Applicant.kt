package ut.isep.management.model.entity

import enumerable.ApplicantStatus
import jakarta.persistence.*

@Entity
open class Applicant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,
    var status: ApplicantStatus = ApplicantStatus.not_started,
    var preferredLanguage: String? = null,

    @ManyToOne(cascade = [CascadeType.ALL])
    var invite: Invite? = null
)