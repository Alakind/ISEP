package ut.isep.management.service

import io.mockk.*
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import ut.isep.management.repository.BaseRepository
import ut.isep.management.service.converter.ReadConverter
import java.time.LocalDate
import java.util.*

class ReadServiceUnitTest {
    private val repository: BaseRepository<TestEntity, UUID> = mockk()
    private val converter: ReadConverter<TestEntity, TestReadDTO> = mockk()
    private val readService = object : ReadService<TestEntity, TestReadDTO, UUID>(repository, converter) {}

    @Test
    fun `test getById() should return DTO when entity exists`() {
        val entityId = UUID.randomUUID()
        val entity = TestEntity(entityId, "Test Name")
        val dto = TestReadDTO(entityId, "Test Name")

        every { repository.findById(entityId) } returns Optional.of(entity)
        every { converter.toDTO(entity) } returns dto

        val result = readService.getById(entityId)

        assertThat(result).isEqualTo(dto)
    }

    @Test
    fun `test getById() should throw NoSuchElementException when entity does not exist`() {
        val entityId = UUID.randomUUID()

        every { repository.findById(entityId) } returns Optional.empty()

        assertThrows<NoSuchElementException> {
            readService.getById(entityId)
        }
    }

    @Test
    fun `test delete() should remove entity when it exists`() {
        val entityId = UUID.randomUUID()
        val entity = TestEntity(entityId, "Test Name")

        every { repository.findById(entityId) } returns Optional.of(entity)
        every { repository.deleteById(entityId) } just Runs

        readService.delete(entityId)

        verify { repository.deleteById(entityId) }
    }

    @Test
    fun `test getAll() should return list of DTOs`() {
        val entity1 = TestEntity(UUID.randomUUID(), "Test 1")
        val entity2 = TestEntity(UUID.randomUUID(), "Test 2")
        val dto1 = TestReadDTO(entity1.id, "Test 1")
        val dto2 = TestReadDTO(entity2.id, "Test 2")

        every { repository.findAll() } returns listOf(entity1, entity2)
        every { converter.toDTO(entity1) } returns dto1
        every { converter.toDTO(entity2) } returns dto2

        val result = readService.getAll()

        assertThat(result).containsExactly(dto1, dto2)
    }

    @Test
    fun `test getPaginatedEntity() should return paginated DTO list`() {
        val pageable: Pageable = PageRequest.of(0, 2)
        val entity1 = TestEntity(UUID.randomUUID(), "Test 1")
        val entity2 = TestEntity(UUID.randomUUID(), "Test 2")
        val dto1 = TestReadDTO(entity1.id, "Test 1")
        val dto2 = TestReadDTO(entity2.id, "Test 2")

        val entityPage: Page<TestEntity> = PageImpl(listOf(entity1, entity2), pageable, 2)

        every { repository.findAll(pageable) } returns entityPage
        every { converter.toDTO(entity1) } returns dto1
        every { converter.toDTO(entity2) } returns dto2
        every { repository.count() } returns 2L

        val result = readService.getPaginatedEntity(pageable = pageable)

        assertThat(result.total).isEqualTo(2)
        assertThat(result.data).containsExactly(dto1, dto2)
    }

    @Test
    fun `test getPaginatedExample() should return paginated DTO list`() {
        val pageable: Pageable = PageRequest.of(0, 2)
        val entity1 = TestEntity(UUID.randomUUID(), "Test 1")
        val entity2 = TestEntity(UUID.randomUUID(), "Test 2")
        val dto1 = TestReadDTO(entity1.id, "Test 1")
        val dto2 = TestReadDTO(entity2.id, "Test 2")

        val entityPage: Page<TestEntity> = PageImpl(listOf(entity1, entity2), pageable, 2)

        every { repository.findAll(pageable) } returns entityPage
        every { converter.toDTO(entity1) } returns dto1
        every { converter.toDTO(entity2) } returns dto2
        every { repository.count() } returns 2L

        val result = readService.getPaginatedExample(pageable = pageable)

        assertThat(result.total).isEqualTo(2)
        assertThat(result.data).containsExactly(dto1, dto2)
    }

    @Test
    fun `test getPaginatedAttributesWithDateRange() should return filtered results`() {
        val pageable: Pageable = PageRequest.of(0, 2)
        val startDate = LocalDate.of(2024, 1, 1)
        val endDate = LocalDate.of(2024, 1, 31)

        val entity1 = TestEntity(UUID.randomUUID(), "Test 1")
        val entity2 = TestEntity(UUID.randomUUID(), "Test 2")
        val dto1 = TestReadDTO(entity1.id, "Test 1")
        val dto2 = TestReadDTO(entity2.id, "Test 2")

        val entityPage: Page<TestEntity> = PageImpl(listOf(entity1, entity2), pageable, 2)

        every { repository.findAll(any(), any<Pageable>()) } returns entityPage
        every { converter.toDTO(entity1) } returns dto1
        every { converter.toDTO(entity2) } returns dto2

        val result = readService.getPaginatedAttributesWithDateRange(
            pageable,
            startDate,
            endDate,
            "createdAt",
            listOf("status"),
            listOf("ACTIVE")
        )

        assertThat(result.total).isEqualTo(2)
        assertThat(result.data).containsExactly(dto1, dto2)
    }


    private fun invokeGetSpecification(
        attributeNames: List<String>?,
        attributeValues: List<Any>?,
        startDate: LocalDate?,
        betweenDateAttribute: String?,
        endDate: LocalDate?
    ): Specification<TestEntity> {
        return readService.javaClass.superclass
            .getDeclaredMethod(
                "getSpecification",
                List::class.java, List::class.java, LocalDate::class.java, String::class.java, LocalDate::class.java
            )
            .apply { isAccessible = true }
            .invoke(readService, attributeNames, attributeValues, startDate, betweenDateAttribute, endDate) as Specification<TestEntity>
    }

    @Test
    fun `test getSpecification() with no attributes should return empty filter`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        every { cb.and(*emptyArray()) } returns mockk()

        val spec = invokeGetSpecification(null, null, null, null, null)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(any(), any()) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with only start date should apply greaterThanOrEqualTo`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        val startDate = LocalDate.of(2024, 1, 1)
        val betweenDateAttribute = "createdAt"

        val predicate: Predicate = mockk()
        every { cb.greaterThanOrEqualTo(root.get(betweenDateAttribute), startDate) } returns predicate
        every { cb.and(any()) } returns mockk()

        val spec = invokeGetSpecification(null, null, startDate, betweenDateAttribute, null)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(any(), any()) }
        verify(exactly = 1) { cb.greaterThanOrEqualTo(root.get(betweenDateAttribute), startDate) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with only end date should apply lessThanOrEqualTo`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        val endDate = LocalDate.of(2024, 1, 31)
        val betweenDateAttribute = "createdAt"

        val predicate: Predicate = mockk()
        every { cb.lessThanOrEqualTo(root.get(betweenDateAttribute), endDate) } returns predicate
        every { cb.and(any()) } returns mockk()

        val spec = invokeGetSpecification(null, null, null, betweenDateAttribute, endDate)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(any(), any()) }
        verify(exactly = 1) { cb.lessThanOrEqualTo(root.get(betweenDateAttribute), endDate) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with null betweenDateAttribute should ignore date filtering`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        every { cb.and(*emptyArray()) } returns mockk()

        val startDate = LocalDate.of(2024, 1, 1)
        val endDate = LocalDate.of(2024, 1, 31)

        val spec = invokeGetSpecification(null, null, startDate, null, endDate)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(any(), any()) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with mismatched attributeNames and attributeValues should throw exception`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        every { cb.equal(root.get<Any>("status"), any<String>()) } returns mockk()
        every { cb.equal(root.get<Any>("type"), any<String>()) } returns mockk()

        val spec = invokeGetSpecification(listOf("status", "type"), listOf("ACTIVE"), null, null, null)

        assertThrows<IndexOutOfBoundsException> {
            spec.toPredicate(root, query, cb)
        }
    }

    @Test
    fun `test getSpecification() with attributeNames and attributeValues`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        val attributeName = "status"
        val attributeValue = "ACTIVE"

        val predicate: Predicate = mockk()
        every { cb.equal(root.get<String>(attributeName), attributeValue) } returns predicate
        every { cb.and(any()) } returns mockk()

        val spec = invokeGetSpecification(listOf(attributeName), listOf(attributeValue), null, null, null)
        spec.toPredicate(root, query, cb)

        verify(exactly = 1) { cb.equal(root.get<String>(attributeName), attributeValue) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with attributeNames and attributeValues (is null)`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        val attributeName = "status"
        val attributeValue = "ACTIVE"
        every { cb.and(*emptyArray()) } returns mockk()

        val spec = invokeGetSpecification(listOf(attributeName), null, null, null, null)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(root.get<String>(attributeName), attributeValue) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }

    @Test
    fun `test getSpecification() with attributeNames (is null) and attributeValues`() {
        val root: Root<TestEntity> = mockk()
        val query: CriteriaQuery<*> = mockk()
        val cb: CriteriaBuilder = mockk()
        val attributeName = "status"
        val attributeValue = "ACTIVE"
        every { cb.and(*emptyArray()) } returns mockk()

        val spec = invokeGetSpecification(null, listOf(attributeValue), null, null, null)
        spec.toPredicate(root, query, cb)

        verify(exactly = 0) { cb.equal(root.get<String>(attributeName), attributeValue) }
        verify(exactly = 0) { cb.greaterThanOrEqualTo(any(), any<LocalDate>()) }
        verify(exactly = 0) { cb.lessThanOrEqualTo(any(), any<LocalDate>()) }
    }
}