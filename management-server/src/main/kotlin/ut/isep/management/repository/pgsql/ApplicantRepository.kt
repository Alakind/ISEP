package ut.isep.management.repository.pgsql

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.pgsql.Applicant


@Repository
interface ApplicantRepository : JpaRepository<Applicant, Long> {

    fun findApplicantById(id: Long): Applicant
}
