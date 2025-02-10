package ut.isep.management.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.UpdateConverter
import java.util.*

class UpdateServiceUnitTest {

    private val repository: JpaRepository<TestEntity, UUID> = mockk()
    private val converter: UpdateConverter<TestEntity, TestUpdateDTO> = mockk()

    private val updateService = object : UpdateService<TestEntity, TestUpdateDTO, UUID>(repository, converter) {}

    @Test
    fun `test update() should modify and save entity`() {
        val entityId = UUID.randomUUID()
        val updateDTO = TestUpdateDTO(entityId, "Updated Name")
        val existingEntity = TestEntity(entityId, "Old Name")
        val updatedEntity = TestEntity(entityId, "Updated Name")

        every { repository.findById(entityId) } returns Optional.of(existingEntity)
        every { converter.updateEntity(existingEntity, updateDTO) } returns updatedEntity
        every { repository.save(updatedEntity) } returns updatedEntity

        val result = updateService.update(updateDTO)

        assertThat(result).isEqualTo(updatedEntity)

        verify { repository.findById(entityId) }
        verify { converter.updateEntity(existingEntity, updateDTO) }
        verify { repository.save(updatedEntity) }
    }

    @Test
    fun `test update() should throw NoSuchElementException when entity does not exist`() {
        val entityId = UUID.randomUUID()
        val updateDTO = TestUpdateDTO(entityId, "Updated Name")

        every { repository.findById(entityId) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            updateService.update(updateDTO)
        }

        assertThat(exception.message).isEqualTo("Entity not found")

        verify { repository.findById(entityId) }
        verify(exactly = 0) { repository.save(any()) }
    }

    @Test
    fun `test update() should throw exception when repository fails`() {
        val entityId = UUID.randomUUID()
        val updateDTO = TestUpdateDTO(entityId, "Updated Name")
        val existingEntity = TestEntity(entityId, "Old Name")
        val updatedEntity = TestEntity(entityId, "Updated Name")

        every { repository.findById(entityId) } returns Optional.of(existingEntity)
        every { converter.updateEntity(existingEntity, updateDTO) } returns updatedEntity
        every { repository.save(updatedEntity) } throws RuntimeException("Database error")

        val exception = assertThrows<RuntimeException> {
            updateService.update(updateDTO)
        }

        assertThat(exception.message).isEqualTo("Database error")

        verify { repository.findById(entityId) }
        verify { converter.updateEntity(existingEntity, updateDTO) }
        verify { repository.save(updatedEntity) }
    }
}
