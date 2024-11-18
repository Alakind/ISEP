package ut.isep.management.model.entity

import enumerable.ApplicantStatus
import jakarta.persistence.*

@Entity
open class Applicant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long = 0,
    open var status: ApplicantStatus = ApplicantStatus.not_started,
    open var preferredLanguage: String? = null,

    @OneToOne(mappedBy = "applicant", cascade = [CascadeType.ALL], orphanRemoval = true)
    open var invite: Invite? = null
)