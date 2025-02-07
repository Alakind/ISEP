package ut.isep.management.service.applicant

import dto.PaginatedDTO
import dto.applicant.ApplicantReadDTO
import dto.invite.InviteReadDTO
import enumerable.InviteStatus
import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.data.domain.*
import org.springframework.data.jpa.domain.Specification
import ut.isep.management.model.entity.Applicant
import ut.isep.management.model.entity.Invite
import ut.isep.management.repository.ApplicantRepository
import ut.isep.management.service.converter.applicant.ApplicantReadConverter
import ut.isep.management.service.converter.invite.InviteReadConverter
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.*

class ApplicantReadServiceUnitTest {
    private val applicantRepository: ApplicantRepository = mockk()
    private val applicantReadConverter: ApplicantReadConverter = mockk()
    private val inviteReadConverter: InviteReadConverter = mockk()
    private val applicantReadService = ApplicantReadService(applicantRepository, applicantReadConverter, inviteReadConverter);
    private val matcher: ExampleMatcher = mockk()


    private val inviteId1: UUID = UUID.randomUUID()
    private val inviteId2: UUID = UUID.randomUUID()
    private val invite1: Invite = Invite(inviteId1)
    private val invite2: Invite = Invite(inviteId1)
    private val invite1ReadDto = InviteReadDTO(
        inviteId1, 1L, assessmentId = 1L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
        measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
    )
    private val invite2ReadDto = InviteReadDTO(
        inviteId2, 1L, assessmentId = 2L, status = InviteStatus.not_started, invitedAt = OffsetDateTime.now(), expiresAt = OffsetDateTime.now().plusWeeks(1),
        measuredSecondsPerSection = listOf(0), assessmentStartedAt = null, assessmentFinishedAt = null, scoredPoints = null, availablePoints = 10
    )
    private val applicantReadDTO = ApplicantReadDTO(
        id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = listOf(inviteId1, inviteId2), createdAt =
            OffsetDateTime.now()
    )
    private val applicant = Applicant(id = 1L, name = "John Doe", email = "john@example.com", preferredLanguage = null, invites = mutableListOf(invite1, invite2), createdAt = OffsetDateTime.now())
    private val pageable: Pageable = PageRequest.of(0, 10)
    private val startDate = LocalDate.of(2024, 12, 1)
    private val endDate = LocalDate.of(2025, 1, 31)

    @Test
    fun whenGetById_thenReturnApplicant() {
        // given
        every { applicantRepository.findById(applicant.id) } returns Optional.of(applicant)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO

        // when
        val result = applicantReadService.getById(applicant.id)

        // then
        verify(exactly = 1) { applicantRepository.findById(applicant.id) }
        verify(exactly = 1) { applicantReadConverter.toDTO(applicant) }
        assertThat(result).isEqualTo(applicantReadDTO)
    }

    @Test
    fun whenGetApplicantById_notFound_thenThrowException() {
        // given
        every { applicantRepository.findById(applicant.id) } returns Optional.empty()

        // when
        try {
            applicantReadService.getById(applicant.id)
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }

        // then
        verify(exactly = 1) { applicantRepository.findById(applicant.id) }
    }

    @Test
    fun whenDelete_thenCallDeleteById() {
        // given
        every { applicantRepository.findById(applicant.id) } returns Optional.of(applicant)
        every { applicantRepository.deleteById(applicant.id) } returns Unit

        // when
        applicantReadService.delete(applicant.id)

        // then
        verify(exactly = 1) { applicantRepository.findById(applicant.id) }
        verify(exactly = 1) { applicantRepository.deleteById(applicant.id) }
    }

    @Test
    fun whenDelete_notFound_thenThrowNoSuchElementException() {
        // given
        every { applicantRepository.findById(applicant.id) } returns Optional.empty()

        // when and then
        try {
            applicantReadService.delete(applicant.id)
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }
    }

    @Test
    fun whenGetAll_thenReturnApplicantList() {
        // given
        every { applicantRepository.findAll() } returns listOf(applicant)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO

        // when
        val result = applicantReadService.getAll()

        // then
        verify(exactly = 1) { applicantRepository.findAll() }
        verify(exactly = 1) { applicantReadConverter.toDTO(applicant) }
        assertThat(result).containsExactly(applicantReadDTO)
    }

    @Test
    fun whenGetPaginatedWithNameEmailExample_thenReturnPaginatedDTO() {
        // given
        val exampleEntity = Applicant(name = "John Doe", email = "john@example.com")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // Arrange
        every { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count(any<Example<Applicant>>()) } returns 1

        // when
        val result = applicantReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count(any<Example<Applicant>>()) }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedWithNameExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = Applicant(name = "John Doe")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // given
        every { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count(any<Example<Applicant>>()) } returns 1

        // when
        val result = applicantReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count(any<Example<Applicant>>()) }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedWithEmailExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = Applicant(email = "john@example.com")
        val example = exampleEntity.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // given
        every { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count(any<Example<Applicant>>()) } returns 1

        // when
        val result = applicantReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count(any<Example<Applicant>>()) }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedWithNullExample_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity: Applicant? = null
        val example = exampleEntity?.let { entity -> Example.of(entity, matcher) }
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // given
        every { applicantRepository.findAll(eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count() } returns 1

        // when
        val result = applicantReadService.getPaginatedExample(example, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count() }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedWithNameEmailExampleEntity_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity = Applicant(name = "John Doe", email = "john@example.com")
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // given
        every { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count(any<Example<Applicant>>()) } returns 1

        // when
        val result = applicantReadService.getPaginatedEntity(exampleEntity, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(any<Example<Applicant>>(), eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count(any<Example<Applicant>>()) }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedWithNullExampleEntity_thenReturnPaginatedDTO() {
        // Variables
        val exampleEntity: Applicant? = null
        val paginatedDTO = PaginatedDTO(1, listOf(applicantReadDTO))

        // given
        every { applicantRepository.findAll(eq(pageable)) } returns PageImpl(listOf(applicant), pageable, 10)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { applicantRepository.count() } returns 1

        // when
        val result = applicantReadService.getPaginatedEntity(exampleEntity, pageable)

        // then
        assertNotNull(result)
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data.size).isEqualTo(1)
        assertThat(result.data).isEqualTo(listOf(applicantReadDTO))
        assertThat(result).isEqualTo(paginatedDTO)
        verify(exactly = 1) { applicantRepository.findAll(eq(pageable)) }
        verify(exactly = 1) { applicantRepository.count() }
        confirmVerified(applicantRepository)
    }

    @Test
    fun whenGetPaginatedAttributesWithDateRange_thenReturnFilteredResults() {
        // given
        val pagedResult = mockk<Page<Applicant>>()
        every { applicantRepository.findAll(any<Specification<Applicant>>(), eq(pageable)) } returns pagedResult
        every { pagedResult.content } returns listOf(applicant)
        every { applicantReadConverter.toDTO(applicant) } returns applicantReadDTO
        every { pagedResult.totalElements } returns 1

        // when
        val result = applicantReadService.getPaginatedAttributesWithDateRange(pageable, startDate, endDate, "createdDate")

        // then
        verify(exactly = 1) { applicantRepository.findAll(any<Specification<Applicant>>(), pageable) }
        verify(exactly = 1) { applicantReadConverter.toDTO(applicant) }
        assertThat(result.total).isEqualTo(1)
        assertThat(result.data).containsExactly(applicantReadDTO)
        assertThat(result).isEqualTo(PaginatedDTO(1, listOf(applicantReadDTO)))
    }

    @Test
    fun whenGetInvitesByApplicantId_thenReturnListInviteReadDTO() {
        // Variables
        val applicantId = 1L

        // given
        every { applicantRepository.findById(applicant.id) } returns Optional.of(applicant)
        every { inviteReadConverter.toDTO(invite1) } returns invite1ReadDto
        every { inviteReadConverter.toDTO(invite2) } returns invite2ReadDto

        // when
        val result = applicantReadService.getInvitesByApplicantId(applicantId)

        // then
        verify(exactly = 1) { applicantRepository.findById(applicantId) }
        verify(exactly = 1) { inviteReadConverter.toDTO(invite1) }
        assertThat(result).contains(invite1ReadDto, invite2ReadDto)
    }
}
