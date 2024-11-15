package ut.isep.management.model.entity

import enumerable.ApplicantStatus
import jakarta.persistence.*
import java.util.*

@Entity
class Applicant(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),
    val status: ApplicantStatus = ApplicantStatus.not_started,
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "interview_id")
    val interview: Interview? = null,
    val preferredLanguage: String? = null,
)