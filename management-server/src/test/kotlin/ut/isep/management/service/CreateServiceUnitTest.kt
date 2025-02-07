package ut.isep.management.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.CreateConverter
import java.util.*

class CreateServiceUnitTest {
    private val repository: JpaRepository<TestEntity, UUID> = mockk()
    private val converter: CreateConverter<TestEntity, TestCreateDTO> = mockk()
    private val createService = object : CreateService<TestEntity, TestCreateDTO, UUID>(repository, converter) {}

    @Test
    fun `test create() should convert DTO and save entity`() {
        val entityId = UUID.randomUUID()
        val createDTO = TestCreateDTO("Test Name")
        val entity = TestEntity(entityId, "Test Name")

        every { converter.fromDTO(createDTO) } returns entity
        every { repository.save(entity) } returns entity

        val result = createService.create(createDTO)

        assertThat(result).isEqualTo(entity)

        verify { converter.fromDTO(createDTO) }
        verify { repository.save(entity) }
    }

    @Test
    fun `test create() should throw exception when repository fails`() {
        val createDTO = TestCreateDTO("Test Name")
        val entity = TestEntity(UUID.randomUUID(), "Test Name")

        every { converter.fromDTO(createDTO) } returns entity
        every { repository.save(entity) } throws RuntimeException("Database error")

        val exception = assertThrows<RuntimeException> {
            createService.create(createDTO)
        }

        assertThat(exception.message).isEqualTo("Database error")

        verify { converter.fromDTO(createDTO) }
        verify { repository.save(entity) }
    }
}