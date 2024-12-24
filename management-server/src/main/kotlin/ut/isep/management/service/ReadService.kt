package ut.isep.management.service

import dto.PaginatedDTO
import dto.ReadDTO
import jakarta.transaction.Transactional
import org.springframework.data.domain.Example
import org.springframework.data.domain.ExampleMatcher
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.model.entity.BaseEntity
import ut.isep.management.service.converter.ReadConverter

@Transactional
abstract class ReadService<E : BaseEntity<ID>, R : ReadDTO, ID : Any>(
    protected val repository: JpaRepository<E, ID>,
    protected val converter: ReadConverter<E, R>
) {
    // override this for custom matcher, this should perhaps be split into searchable and non-searchable ReadService
    open val matcher = ExampleMatcher.matching().withIgnoreNullValues()

    // functions are marked as open otherwise @Transactional cannot override them to create proxies, apparently
    open fun getById(id: ID): R {
        val entity = repository.findById(id).orElseThrow { NoSuchElementException("Entity not found") }
        return converter.toDTO(entity)
    }

    open fun delete(id: ID) {
        repository.deleteById(id)
    }

    open fun getAll(): List<R> {
        return repository.findAll().map { converter.toDTO(it) }
    }

    open fun getPaginated(exampleEntity: E? = null, pageable: Pageable): PaginatedDTO<R> {
        val example = exampleEntity?.let { entity ->
            Example.of(entity, matcher)
        }
        val entities = if (example != null) {
            repository.findAll(example, pageable).map { converter.toDTO(it) }.content
        } else {
            repository.findAll(pageable).map { converter.toDTO(it) }.content
        }
        val amount = if (example != null) {
            repository.count(example)
        } else {
            repository.count()
        }
        return PaginatedDTO(amount, entities)
    }

    private fun parseSort(sort: String?): Sort {
        if (sort.isNullOrEmpty()) {
            return Sort.unsorted()
        }
        val orders = sort.split(",").map { field ->
            val entry = field.split(":")
            val attribute = entry[0]
            val direction = if (entry.size == 2) {
                Sort.Direction.fromString(entry[1])
            } else {
                Sort.Direction.ASC
            }
            Sort.Order(direction, attribute)
        }
        return Sort.by(orders)
    }
}
