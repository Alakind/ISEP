package ut.isep.management

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import ut.isep.management.model.entity.Applicant
import ut.isep.management.repository.ApplicantRepository

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.AUTO_CONFIGURED)
class JPARepositoryIT @Autowired constructor(
    private val applicantRepository: ApplicantRepository
) : TestContainersIT() {

    @Test
    fun `test repository connection to PostgreSQL`() {
        assertEquals(0, applicantRepository.findAll().size)
        applicantRepository.save(
            Applicant(name = "name", preferredLanguage = null, email = "email")
        )
        val retrievedAplicants = applicantRepository.findAll()
        assertEquals(1, retrievedAplicants.size)
        assertEquals("name", retrievedAplicants[0].name)
        assertEquals("email", retrievedAplicants[0].email)
        applicantRepository.deleteAll()
        assertEquals(0, applicantRepository.findAll().size)
    }
}
