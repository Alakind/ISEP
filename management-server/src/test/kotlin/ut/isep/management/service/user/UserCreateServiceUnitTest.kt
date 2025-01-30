package ut.isep.management.service.user

import dto.user.UserCreateDTO
import enumerable.UserRole
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import ut.isep.management.service.converter.user.UserCreateConverter

class UserCreateServiceUnitTest {
    private val userRepository: UserRepository = mockk()
    private val userCreateConverter: UserCreateConverter = mockk()
    private val applicantCreateService = UserCreateService(userRepository, userCreateConverter);

    private val userCreateDTO = UserCreateDTO(name = "John Doe", email = "john@example.com", oid = "dsfsfe9f0isi", role = UserRole.Admin)
    private val user = User(id = 1L, name = "John Doe", email = "john@example.com", oid = "dsfsfe9f0isi", role = UserRole.Admin)

    @Test
    fun whenCreateApplicant_thenReturnApplicant() {
        // given
        every { userCreateConverter.fromDTO(userCreateDTO) } returns user
        every { userRepository.save(user) } returns user

        // when
        val result = applicantCreateService.create(userCreateDTO)

        // then
        verify(exactly = 1) { userCreateConverter.fromDTO(userCreateDTO) }
        verify(exactly = 1) { userRepository.save(user) }
        assertThat(result).isEqualTo(user)
    }
}