package ut.isep.management.repository.pgsql

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Applicant
import java.util.*


@Repository
interface ApplicantRepository : JpaRepository<Applicant, UUID> {
}
