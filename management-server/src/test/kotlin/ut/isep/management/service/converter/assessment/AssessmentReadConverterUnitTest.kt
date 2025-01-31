package ut.isep.management.service.converter.assessment

import dto.assessment.AssessmentReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import ut.isep.management.model.entity.Assessment
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.service.assessment.AssessmentReadService
import java.util.*

class AssessmentReadConverterUnitTest {
    private val assessmentRepository: AssessmentRepository = mockk()
    private val assessmentReadConverter: AssessmentReadConverter = mockk()
    private val assessmentReadService = AssessmentReadService(assessmentRepository, assessmentReadConverter)

    private val assessmentReadDTO = AssessmentReadDTO(id = 1L, tag = "Java Developer", commit = "abc", 180, listOf(1, 2))
    private val assessment = Assessment(id = 1L, tag = "Java Developer", gitCommitHash = "abc", mutableListOf(), mutableListOf(), latest = true)

    @Test
    fun whenReadAssessment_thenReturnAssessment() {
        // given
        every { assessmentReadConverter.toDTO(assessment) } returns assessmentReadDTO
        every { assessmentRepository.findById(assessment.id) } returns Optional.of(assessment)

        // when
        val result = assessmentReadService.getById(assessmentReadDTO.id)

        // then
        verify(exactly = 1) { assessmentReadConverter.toDTO(assessment) }
        verify(exactly = 1) { assessmentRepository.findById(assessment.id) }
        assertThat(result).isEqualTo(assessmentReadDTO)
    }
}