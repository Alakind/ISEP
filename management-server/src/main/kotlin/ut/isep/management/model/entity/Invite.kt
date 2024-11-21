package ut.isep.management.model.entity

import jakarta.persistence.*
import java.time.ZonedDateTime
import java.util.*

@Entity
class Invite(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),

    @OneToOne
    @JoinColumn(name = "applicant_id")
    val applicant: Applicant = Applicant(),

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    val assessment: Assessment = Assessment(),

    val invitedAt: ZonedDateTime = ZonedDateTime.now()
)
