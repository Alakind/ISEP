package ut.isep.management.service.user

import dto.user.UserUpdateDTO
import enumerable.UserRole
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.model.entity.User
import ut.isep.management.service.converter.UpdateConverter
import java.util.*

class UserUpdateServiceUnitTest {
    private val userRepository: JpaRepository<User, Long> = mockk()
    private val userUpdateConverter: UpdateConverter<User, UserUpdateDTO> = mockk()
    private val userUpdateService = UserUpdateService(userRepository, userUpdateConverter)

    private val user = User(id = 1L, name = "John Doe", email = "john@example.com")
    private val updatedUser = User(id = 1L, name = "John Doe", email = "john.doe@example.com")
    private val userUpdateDTO = UserUpdateDTO(id = 1L, name = "John Doe", email = "john.doe@example.com", role = UserRole.Admin)

    @Test
    fun whenUpdateApplicant_thenUpdateEntity() {
        // given
        every { userRepository.findById(1L) } returns Optional.of(user)
        every { userUpdateConverter.updateEntity(user, userUpdateDTO) } returns updatedUser
        every { userRepository.save(updatedUser) } returns updatedUser

        // when
        val result = userUpdateService.update(userUpdateDTO)

        // then
        verify(exactly = 1) { userRepository.findById(1L) }
        verify(exactly = 1) { userUpdateConverter.updateEntity(user, userUpdateDTO) }
        verify(exactly = 1) { userRepository.save(updatedUser) }
        assertThat(result).isEqualTo(updatedUser)
    }
}