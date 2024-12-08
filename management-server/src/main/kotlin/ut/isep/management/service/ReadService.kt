package ut.isep.management.service

import dto.PaginatedDTO
import dto.ReadDTO
import entity.BaseEntity
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import ut.isep.management.service.converter.ReadConverter

@Transactional
abstract class ReadService<E : BaseEntity<ID>, R : ReadDTO, ID : Any>(
    protected val repository: JpaRepository<E, ID>,
    protected val converter: ReadConverter<E, R>
) {
    // functions are marked as open otherwise @Transactional cannot override them to create proxies, apparently
    open fun getById(id: ID): R {
        val entity = repository.findById(id).orElseThrow { NoSuchElementException("Entity not found") }
        return converter.toDTO(entity)
    }

    open fun delete(id: ID) {
        repository.deleteById(id)
    }

    open fun getAll(): List<R> {
        return repository.findAll().map {converter.toDTO(it)}
    }

    open fun getPaginated(limit: Int?, page: Int?, sort: String?): PaginatedDTO<R> {
        val sortCriteria = parseSort(sort)
        val entities = if (limit != null) {
            val pageable = PageRequest.of(page ?: 0, limit, sortCriteria)
            repository.findAll(pageable).content.map {converter.toDTO(it)}
        } else {
            repository.findAll(sortCriteria).map {converter.toDTO(it)}
        }
        val amount = repository.count()
        return PaginatedDTO(amount, entities)
    }

    private fun parseSort(sort: String?): Sort {
        if (sort.isNullOrEmpty()) {
            return Sort.unsorted()
        }
        val orders = sort.split(",").map { field ->
            val entry = field.split(":")
            val attribute = entry[0]
            val direction = if (entry.size == 2) { Sort.Direction.fromString(entry[1]) } else {
                Sort.Direction.ASC
            }
            Sort.Order(direction, attribute)
        }
        return Sort.by(orders)
    }
}
