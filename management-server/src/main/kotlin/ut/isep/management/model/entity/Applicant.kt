package ut.isep.management.model.entity

import enumerable.ApplicantStatus
import jakarta.persistence.*
import java.util.*

@Entity
open class Applicant(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),
    var status: ApplicantStatus = ApplicantStatus.not_started,
    var preferredLanguage: String? = null,

    @ManyToOne(cascade = [CascadeType.ALL])
    var invite: Invite? = null
)