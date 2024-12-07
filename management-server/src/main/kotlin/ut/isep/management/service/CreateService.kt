package ut.isep.management.service

import dto.CreateDTO
import entity.BaseEntity
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.CreateConverter

abstract class CreateService<E : BaseEntity<ID>, C : CreateDTO, ID : Any>(
    protected val repository: JpaRepository<E, ID>,
    protected val converter: CreateConverter<E, C>
) {
    fun create(dto: C): E {
        val entity = converter.fromDTO(dto)
        return repository.save(entity)
    }
}
