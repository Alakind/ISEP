//TODO: this is not working anymore with the new test environment

//package ut.isep.management
//
//import org.junit.jupiter.api.Test
//import org.junit.jupiter.api.extension.ExtendWith
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
//import org.springframework.test.context.junit.jupiter.SpringExtension
//import ut.isep.management.model.entity.Applicant
//import ut.isep.management.repository.ApplicantRepository
//
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@ExtendWith(SpringExtension::class)
//@DataJpaTest
//class PostgreSQLRepositoryTests @Autowired constructor(
//    private val applicantRepository: ApplicantRepository
//) {
//
//    @Test
//    fun `test repository connection to PostgreSQL`() {
//        applicantRepository.save(
//            Applicant(preferredLanguage = null)
//        )
//        assert(true)
//    }
//}
