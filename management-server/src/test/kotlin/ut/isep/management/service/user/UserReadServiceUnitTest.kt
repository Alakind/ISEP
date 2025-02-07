package ut.isep.management.service.user

import dto.PaginatedDTO
import dto.user.UserReadDTO
import enumerable.UserRole
import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.data.domain.*
import org.springframework.data.jpa.domain.Specification
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import ut.isep.management.service.converter.user.UserReadConverter
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.*

class UserReadServiceUnitTest {
    private val userRepository: UserRepository = mockk()
    private val userReadConverter: UserReadConverter = mockk()
    private val userReadService = UserReadService(userRepository, userReadConverter);
    private val matcher: ExampleMatcher = mockk()


    private val userReadDTO = UserReadDTO(
        id = 1L, name = "John Doe", email = "john@example.com", oid = "dsfsfe9f0isi", role = UserRole.Admin, createdAt =
            OffsetDateTime.now()
    )
    private val user = User(id = 1L, name = "John Doe", email = "john@example.com", oid = "dsfsfe9f0isi", role = UserRole.Admin, createdAt = OffsetDateTime.now())
    private val pageable: Pageable = PageRequest.of(0, 10)
    private val startDate = LocalDate.of(2024, 12, 1)
    private val endDate = LocalDate.of(2025, 1, 31)

    @Test
    fun whenGetById_thenReturnUser() {
        // given
        every { userRepository.findById(user.id) } returns Optional.of(user)
        every { userReadConverter.toDTO(user) } returns userReadDTO

        // when
        val result = userReadService.getById(user.id)

        // then
        verify(exactly = 1) { userRepository.findById(user.id) }
        verify(exactly = 1) { userReadConverter.toDTO(user) }
        assertThat(result).isEqualTo(userReadDTO)
    }

    @Test
    fun whenGetUserById_notFound_thenThrowException() {
        // given
        every { userRepository.findById(user.id) } returns Optional.empty()

        // when
        try {
            userReadService.getById(user.id)
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }

        // then
        verify(exactly = 1) { userRepository.findById(user.id) }
    }

    @Test
    fun whenDelete_thenCallDeleteById() {
        // given
        every { userRepository.findById(user.id) } returns Optional.of(user)
        every { userRepository.deleteById(user.id) } returns Unit

        // when
        userReadService.delete(user.id)

        // then
        verify(exactly = 1) { userRepository.findById(user.id) }
        verify(exactly = 1) { userRepository.deleteById(user.id) }
    }

    @Test
    fun whenDelete_notFound_thenThrowNoSuchElementException() {
        // given
        every { userRepository.findById(user.id) } returns Optional.empty()

        // when and then
        try {
            userReadService.delete(user.id)
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }
    }

    @Test
    fun whenGetAll_thenReturnUserList() {
        // given
        every { userRepository.findAll() } returns listOf(user)
        every { userReadConverter.toDTO(user) } returns userReadDTO

        // when
        val result = userReadService.getAll()

        // then
        verify(exactly = 1) { userRepository.findAll() }
        verify(exactly = 1) { userReadConverter.toDTO(user) }
        assertThat(result).containsExactly(userReadDTO)
    }

    @Test
    fun whenGetPaginatedWithNameEmailExample_thenReturnPaginatedDTO() {
        // given
        val exampleEntity = User(name = "John Doe", email = "john@example.com")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // Arrange
        every { userRepository.findAll(any<Example<User>>(), eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count(any<Example<User>>()) } returns 1

        // when
        val result = userReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(any<Example<User>>(), eq(pageable)) }
        verify(exactly = 1) { userRepository.count(any<Example<User>>()) }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedWithNameExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = User(name = "John Doe")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // given
        every { userRepository.findAll(any<Example<User>>(), eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count(any<Example<User>>()) } returns 1

        // when
        val result = userReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(any<Example<User>>(), eq(pageable)) }
        verify(exactly = 1) { userRepository.count(any<Example<User>>()) }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedWithEmailExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = User(email = "john@example.com")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // given
        every { userRepository.findAll(any<Example<User>>(), eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count(any<Example<User>>()) } returns 1

        // when
        val result = userReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(any<Example<User>>(), eq(pageable)) }
        verify(exactly = 1) { userRepository.count(any<Example<User>>()) }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedWithNullExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity: User? = null
        val example = exampleEntity?.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // given
        every { userRepository.findAll(eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count() } returns 1

        // when
        val result = userReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(eq(pageable)) }
        verify(exactly = 1) { userRepository.count() }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedWithNameEmailExampleEntity_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = User(name = "John Doe", email = "john@example.com")
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // given
        every { userRepository.findAll(any<Example<User>>(), eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count(any<Example<User>>()) } returns 1

        // when
        val result = userReadService.getPaginatedEntity(exampleEntity, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(any<Example<User>>(), eq(pageable)) }
        verify(exactly = 1) { userRepository.count(any<Example<User>>()) }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedWithNullExampleEntity_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity: User? = null
        val paginatedDTO = PaginatedDTO(1, listOf(userReadDTO))

        // given
        every { userRepository.findAll(eq(pageable)) } returns PageImpl(listOf(user), pageable, 10)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { userRepository.count() } returns 1

        // when
        val result = userReadService.getPaginatedEntity(exampleEntity, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(userReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { userRepository.findAll(eq(pageable)) }
        verify(exactly = 1) { userRepository.count() }
        confirmVerified(userRepository)
    }

    @Test
    fun whenGetPaginatedAttributesWithDateRange_thenReturnFilteredResults() {
        // given
        val pagedResult = mockk<Page<User>>()
        every { userRepository.findAll(any<Specification<User>>(), eq(pageable)) } returns pagedResult
        every { pagedResult.content } returns listOf(user)
        every { userReadConverter.toDTO(user) } returns userReadDTO
        every { pagedResult.totalElements } returns 1

        // when
        val result = userReadService.getPaginatedAttributesWithDateRange(pageable, startDate, endDate, "createdDate")

        // then
        verify(exactly = 1) { userRepository.findAll(any<Specification<User>>(), pageable) }
        verify(exactly = 1) { userReadConverter.toDTO(user) }
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data).containsExactly(userReadDTO)
        assertThat(result).isEqualTo(PaginatedDTO(1, listOf(userReadDTO)))
    }
}
