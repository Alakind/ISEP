package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.Applicant


@Repository
interface ApplicantRepository : BaseRepository<Applicant, Long>
