package ut.isep.management.service

import dto.UpdateDTO
import entity.BaseEntity
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.UpdateConverter


abstract class UpdateService<E : BaseEntity<ID>, U : UpdateDTO<ID>, ID : Any>(
    private val repository: JpaRepository<E, ID>,
    private val converter: UpdateConverter<E, U>
) {
    fun update(updateDTO: U): E {
        val existingEntity = repository.findById(updateDTO.id).orElseThrow { NoSuchElementException("Entity not found") }
        return repository.save(converter.updateEntity(existingEntity, updateDTO))
    }
}
