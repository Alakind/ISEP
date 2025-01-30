package ut.isep.management.service.assessment

import dto.assessment.AssessmentReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.data.domain.*
import ut.isep.management.model.entity.Assessment
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.service.converter.assessment.AssessmentReadConverter
import java.util.*

class AssessmentReadServiceUnitTest {
    private val assessmentRepository: AssessmentRepository = mockk()
    private val assessmentReadConverter: AssessmentReadConverter = mockk()
    private val assessmentReadService: AssessmentReadService = AssessmentReadService(assessmentRepository, assessmentReadConverter)

    private val assessment1 = Assessment(1L, "Java Developer", "sdflk3rlcjd9vupm3jpqrj90svjmsjf0u", mutableListOf(), mutableListOf(), true)
    private val assessment2 = Assessment(2L, "Java Developer", "s8fui4jrf8yv9udjoxvhn97dy9sf8s9ff", mutableListOf(), mutableListOf(), true)
    private val assessment1ReadDto = AssessmentReadDTO(1L, "Java Developer", "sdflk3rlcjd9vupm3jpqrj90svjmsjf0u", 1800, listOf(1, 2))
    private val assessment2ReadDto = AssessmentReadDTO(2L, "Java Developer", "s8fui4jrf8yv9udjoxvhn97dy9sf8s9ff", 1800, listOf(1, 2))
    private val pageable: Pageable = PageRequest.of(0, 10)

    @Test
    fun whenGetById_thenReturnAssessment() {
        // given
        every { assessmentRepository.findById(assessment1.id) } returns Optional.of(assessment1)
        every { assessmentReadConverter.toDTO(assessment1) } returns assessment1ReadDto

        // when
        val result = assessmentReadService.getById(assessment1.id)

        // then
        verify(exactly = 1) { assessmentRepository.findById(assessment1.id) }
        verify(exactly = 1) { assessmentReadConverter.toDTO(assessment1) }
        assertThat(result).isEqualTo(assessment1ReadDto)
    }

    @Test
    fun whenGetAssessmentById_notFound_thenThrowException() {
        // given
        every { assessmentRepository.findById(assessment1.id) } returns Optional.empty()

        // when
        try {
            assessmentReadService.getById(assessment1.id)
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }

        // then
        verify(exactly = 1) { assessmentRepository.findById(assessment1.id) }
    }


    @Test
    fun whenGetByLatestPaginatedDataExists_thenReturnPaginatedReadDto() {
        // variables
        val assessments = listOf(assessment1, assessment2)
        val page: Page<Assessment> = PageImpl(assessments, pageable, assessments.size.toLong())

        // given
        every { assessmentRepository.findAll(any<Example<Assessment>>(), eq(pageable)) } returns page
        every { assessmentReadConverter.toDTO(assessment1) } returns assessment1ReadDto
        every { assessmentReadConverter.toDTO(assessment2) } returns assessment2ReadDto
        every { assessmentRepository.count(any<Example<Assessment>>()) } returns 1

        // when
        val result = assessmentReadService.getLatestPaginated(pageable)

        // then
        assertNotNull(result)
        assertThat(result.data.size).isEqualTo(2)
    }

    @Test
    fun whenDataIsEmpty_thenReturnEmpty() {
        // variables
        val pageable: Pageable = PageRequest.of(0, 10)
        val page: Page<Assessment> = PageImpl(emptyList(), pageable, 0)

        // given
        every { assessmentRepository.findAll(any<Example<Assessment>>(), eq(pageable)) } returns page
        every { assessmentRepository.count(any<Example<Assessment>>()) } returns 0

        // when
        val result = assessmentReadService.getLatestPaginated(pageable)

        // then
        assertNotNull(result)
        assertThat(result.data.isEmpty())
    }

    @Test
    fun whenGetLatestById_thenReturnAssessmentReadDto() {
        // given
        every { assessment1.tag?.let { assessmentRepository.findByTagAndLatestTrue(it) } } returns assessment1
        every { assessmentReadConverter.toDTO(assessment1) } returns assessment1ReadDto

        // when
        val result = assessment1.tag?.let { assessmentReadService.getLatestByTag(it) }

        // then
        verify(exactly = 1) { assessment1.tag?.let { assessmentRepository.findByTagAndLatestTrue(it) } }
        verify(exactly = 1) { assessmentReadConverter.toDTO(assessment1) }
        assertThat(result).isEqualTo(assessment1ReadDto)
    }

    @Test
    fun whenGetAssessmentByTag_notFound_thenThrowException() {
        // given
        every { assessment1.tag?.let { assessmentRepository.findByTagAndLatestTrue(it) } } returns null

        // when
        try {
            assessment1.tag?.let { assessmentReadService.getLatestByTag(it) }
        } catch (e: NoSuchElementException) {
            assertThat(e.message).isEqualTo("Entity not found")
        }

        // then
        verify(exactly = 1) { assessment1.tag?.let { assessmentRepository.findByTagAndLatestTrue(it) } }
    }
}