package ut.isep.management

import enumerable.ApplicantStatus
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension::class)
@DataJpaTest
class PostgreSQLRepositoryTests @Autowired constructor(
    private val applicantRepository: ApplicantRepository
) {

    @Test
    fun `test repository connection to PostgreSQL`() {
        val entity = applicantRepository.save(
            Applicant(status = ApplicantStatus.app_finished, preferredLanguage = null)
        )
        assert(true)
    }
}
