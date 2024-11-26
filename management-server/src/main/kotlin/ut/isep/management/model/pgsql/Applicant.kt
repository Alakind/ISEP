package ut.isep.management.model.pgsql

import enumerable.ApplicantStatus
import jakarta.persistence.*

@Entity
class Applicant(
    val status: ApplicantStatus = ApplicantStatus.not_started,
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "interview_id")
    val interview: Interview? = null,
    val preferredLanguage: String? = null,
) {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0
}