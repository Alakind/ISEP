package ut.isep.management.service.section

import dto.assignment.ReferenceAssignmentOpenReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import parser.question.OpenQuestion
import reactor.core.publisher.Mono
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.Section
import ut.isep.management.repository.SectionRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.assignment.ReferenceAssignmentReadConverter
import ut.isep.management.service.converter.section.SectionReadConverter
import java.util.*

class SectionReadServiceUnitTest {

    private lateinit var sectionReadService: SectionReadService

    private val repository: SectionRepository = mockk()
    private val fetchService: AsyncAssignmentFetchService = mockk()
    private val sectionReadConverter: SectionReadConverter = mockk()
    private val assignmentReadConverter: ReferenceAssignmentReadConverter = mockk()

    @BeforeEach
    fun setup() {
        sectionReadService = SectionReadService(repository, fetchService, sectionReadConverter, assignmentReadConverter)
    }

    @Test
    fun `test getAll() fetches sections and assignments`() {
        val section1 = mockk<Section> {
            every { id } returns 1L
            every { assessment } returns mockk { every { gitCommitHash } returns "commit1" }
            every { assignments } returns mutableListOf(
                mockk<Assignment> { every { id } returns 101L },
                mockk<Assignment> { every { id } returns 102L }
            )
        }
        val section2 = mockk<Section> {
            every { id } returns 2L
            every { assessment } returns mockk { every { gitCommitHash } returns "commit2" }
            every { assignments } returns mutableListOf(
                mockk<Assignment> { every { id } returns 201L }
            )
        }

        every { repository.findAll() } returns listOf(section1, section2)

        val assignment1 = mockk<ReferenceAssignmentOpenReadDTO> { every { id } returns 101L }
        val assignment2 = mockk<ReferenceAssignmentOpenReadDTO> { every { id } returns 102L }
        val assignment3 = mockk<ReferenceAssignmentOpenReadDTO> { every { id } returns 201L }

        every { fetchService.fetchAssignment(any(), any()) } answers {
            val assignment = firstArg<Assignment>()
            when (assignment.id) {
                101L -> Mono.just(mockk<OpenQuestion> { every { id } returns 101L })
                102L -> Mono.just(mockk<OpenQuestion> { every { id } returns 102L })
                201L -> Mono.just(mockk<OpenQuestion> { every { id } returns 201L })
                else -> Mono.empty()
            }
        }

        every { assignmentReadConverter.toDTO(any()) } answers {
            val fetchedQuestion = firstArg<OpenQuestion>()
            when (fetchedQuestion.id) {
                101L -> assignment1
                102L -> assignment2
                201L -> assignment3
                else -> throw IllegalArgumentException("Unexpected assignment ID")
            }
        }

        every { sectionReadConverter.toDTO(section1, listOf(assignment1, assignment2)) } returns mockk()
        every { sectionReadConverter.toDTO(section2, listOf(assignment3)) } returns mockk()

        val result = sectionReadService.getAll()

        assertEquals(2, result.size)
        verify(exactly = 2) { sectionReadConverter.toDTO(any(), any()) }
    }

    @Test
    fun `test getById() fetches section and assignments`() {
        val section = mockk<Section> {
            every { id } returns 1L
            every { assessment } returns mockk { every { gitCommitHash } returns "commit123" }
            every { assignments } returns mutableListOf(
                mockk { every { id } returns 101L }
            )
        }
        val assignmentDTO = mockk<ReferenceAssignmentOpenReadDTO> { every { id } returns 101L }

        every { repository.findById(1L) } returns Optional.of(section)

        every { fetchService.fetchAssignment(any(), any()) } returns Mono.just(mockk<OpenQuestion> { every { id } returns 101L })
        every { assignmentReadConverter.toDTO(any()) } returns assignmentDTO
        every { sectionReadConverter.toDTO(section, listOf(assignmentDTO)) } returns mockk()

        val result = sectionReadService.getById(1L)

        assertNotNull(result)
        verify { sectionReadConverter.toDTO(section, listOf(assignmentDTO)) }
    }

    @Test
    fun `test getById() throws exception when section not found`() {
        every { repository.findById(99L) } returns Optional.empty()

        assertThrows<NoSuchElementException> { sectionReadService.getById(99L) }
    }

    @Test
    fun `test getAllIds() returns section IDs`() {
        every { repository.findAll() } returns listOf(
            mockk { every { id } returns 1L },
            mockk { every { id } returns 2L }
        )

        val result = sectionReadService.getAllIds()

        assertEquals(listOf(1L, 2L), result)
    }
}
