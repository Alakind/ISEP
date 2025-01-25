package ut.isep.management.service

import dto.PaginatedDTO
import dto.ReadDTO
import jakarta.persistence.criteria.Predicate
import jakarta.transaction.Transactional
import org.springframework.data.domain.Example
import org.springframework.data.domain.ExampleMatcher
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.domain.Specification.where
import ut.isep.management.model.entity.BaseEntity
import ut.isep.management.repository.BaseRepository
import ut.isep.management.service.converter.ReadConverter
import java.time.LocalDate

@Transactional
abstract class ReadService<E : BaseEntity<ID>, R : ReadDTO, ID : Any>(
    protected open val repository: BaseRepository<E, ID>,
    protected val converter: ReadConverter<E, R>
) {
    // override this for custom matcher, this should perhaps be split into searchable and non-searchable ReadService
    open val matcher: ExampleMatcher = ExampleMatcher.matching().withIgnoreNullValues()

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

    open fun getPaginatedAttributesWithDateRange(
        pageable: Pageable?,
        startDate: LocalDate?,
        endDate: LocalDate?,
        betweenDateAttribute: String?,
        attributeNames: List<String>? = null,
        attributeValues: List<Any>? = null
    ): PaginatedDTO<R> {
        val querySpec = where<E> { root, _, cb ->
            val predicates = mutableListOf<Predicate>()

            if (attributeNames != null && attributeValues != null) {
                attributeNames.forEachIndexed { index, attributeName ->
                    predicates.add(cb.equal(root.get<Any>(attributeName), attributeValues[index]))
                }
            }

            if (startDate != null && betweenDateAttribute != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get(betweenDateAttribute), startDate))
            }

            if (endDate != null && betweenDateAttribute != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get(betweenDateAttribute), endDate))
            }

            cb.and(*predicates.toTypedArray())
        }

        val pagedResult = repository.findAll(querySpec, pageable ?: Pageable.unpaged())

        return PaginatedDTO(
            total = pagedResult.totalElements,
            data = pagedResult.content.map { converter.toDTO(it) }
        )
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
