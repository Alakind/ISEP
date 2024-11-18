package ut.isep.management.model.entity

import jakarta.persistence.*
import java.time.ZonedDateTime

@Entity
class Invite(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @ManyToOne
    @JoinColumn(name = "applicant_id")
    val applicant: Applicant = Applicant(),

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    val assessment: Assessment = Assessment(),

    val invitedAt: ZonedDateTime = ZonedDateTime.now()
)
