package ut.isep.management.service

import dto.CreateDTO
import ut.isep.management.model.entity.BaseEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.CreateConverter

@Transactional
abstract class CreateService<E : BaseEntity<ID>, C : CreateDTO, ID : Any>(
    protected val repository: JpaRepository<E, ID>,
    protected val converter: CreateConverter<E, C>
) {
    // functions are marked as open otherwise @Transactional cannot override them to create proxies
    open fun create(dto: C): E {
        val entity = converter.fromDTO(dto)
        return repository.save(entity)
    }
}
