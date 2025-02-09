package ut.isep.management.service.solution

import dto.assignment.SolvedAssignmentOpenReadDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.repository.findByIdOrNull
import parser.question.OpenQuestion
import reactor.core.publisher.Mono
import ut.isep.management.model.entity.*
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.solution.SolvedAssignmentReadConverter
import java.util.*

class SolutionReadServiceUnitTest {
    private val solvedAssignmentRepository: SolvedAssignmentRepository = mockk()
    private val solvedAssignmentReadConverter: SolvedAssignmentReadConverter = mockk()
    private val assignmentFetchService: AsyncAssignmentFetchService = mockk()
    private val inviteRepository: InviteRepository = mockk()
    private val sectionRepository: SectionRepository = mockk()
    private val solutionReadService: SolutionReadService = SolutionReadService(
        solvedAssignmentRepository, solvedAssignmentReadConverter, assignmentFetchService, inviteRepository,
        sectionRepository
    )

    private val inviteId = UUID.randomUUID()
    private val section = Section(
        id = 1L,
        title = "Title",
        assignments = mutableListOf(Assignment(id = 1L), Assignment(id = 2L))
    )

    @Test
    fun `test getSolvedAssignments() that NoSuchElementException is thrown when invite can't be found`() {
        every { inviteRepository.existsById(inviteId) } returns false

        val exception = assertThrows<NoSuchElementException> {
            solutionReadService.getSolvedAssignments(inviteId, section)
        }
        assertThat(exception.message).isEqualTo("No invite with ID: $inviteId")
    }

    @Test
    fun `test getSolvedAssignments() that correct solved assignments are returned`() {
        val solvedAssignment1 = SolvedAssignmentOpen(SolvedAssignmentId(inviteId, 1L))
        val solvedAssignment2 = SolvedAssignmentCoding(SolvedAssignmentId(inviteId, 2L))

        every { inviteRepository.existsById(inviteId) } returns true
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId, 1L)) } returns solvedAssignment1
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId, 2L)) } returns solvedAssignment2

        val result = solutionReadService.getSolvedAssignments(inviteId, section)

        assertThat(result).containsExactly(solvedAssignment1, solvedAssignment2)
        verify { inviteRepository.existsById(inviteId) }
        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId, 1L)) }
        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId, 2L)) }
    }


    @Test
    fun `test getSolvedSection() that NoSuchElementException is thrown when section can't be found`() {
        every { sectionRepository.findById(section.id) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            solutionReadService.getSolvedSection(inviteId, section.id)
        }
        assertThat(exception.message).isEqualTo("No section with ID: ${section.id}")
    }

    @Test
    fun `test getSolvedSection() that correct SolvedSectionReadDTO is returned`() {
        // Given
        val inviteId = UUID.randomUUID()
        val sectionId = 10L

        val assignment1 = mockk<Assignment> {
            every { id } returns 101L
        }
        val assignment2 = mockk<Assignment> {
            every { id } returns 102L
        }

        val section = mockk<Section> {
            every { id } returns sectionId
            every { title } returns "Mock Section"
            every { availablePoints } returns 100
            every { availableSeconds } returns 3600
            every { assignments } returns mutableListOf(
                assignment1,
                assignment2
            )
        }

        val inviteMockk = mockk<Invite> {
            every { id } returns inviteId
            every { assessment?.gitCommitHash } returns "mockCommitHash"
        }

        val key1 = SolvedAssignmentId(inviteId, 101L)
        val key2 = SolvedAssignmentId(inviteId, 102L)

        val solvedAssignment1 = mockk<SolvedAssignmentOpen> {
            every { id } returns key1
            every { assignment } returns assignment1
            every { invite } returns inviteMockk
        }
        val solvedAssignment2 = mockk<SolvedAssignmentOpen> {
            every { id } returns key2
            every { assignment } returns assignment2
            every { invite } returns inviteMockk
        }


        val question1 = mockk<OpenQuestion> { every { id } returns 101L }
        val question2 = mockk<OpenQuestion> { every { id } returns 102L }

        val solvedAssignmentDTO1 = mockk<SolvedAssignmentOpenReadDTO> { every { id } returns 101L }
        val solvedAssignmentDTO2 = mockk<SolvedAssignmentOpenReadDTO> { every { id } returns 102L }

        // Mocks
        every { inviteRepository.existsById(inviteId) } returns true
        every { sectionRepository.findById(sectionId) } returns Optional.of(section)

        every { solvedAssignmentRepository.findByIdOrNull(key1) } returns solvedAssignment1
        every { solvedAssignmentRepository.findByIdOrNull(key2) } returns solvedAssignment2

        every { assignmentFetchService.fetchAssignment(solvedAssignment1.assignment!!, "mockCommitHash") } returns Mono.just(question1)
        every { assignmentFetchService.fetchAssignment(solvedAssignment2.assignment!!, "mockCommitHash") } returns Mono.just(question2)

        every { solvedAssignmentReadConverter.toDTO(solvedAssignment1, question1) } returns solvedAssignmentDTO1
        every { solvedAssignmentReadConverter.toDTO(solvedAssignment2, question2) } returns solvedAssignmentDTO2

        // When
        val result = solutionReadService.getSolvedSection(inviteId, sectionId)

        // Then
        assertNotNull(result)
        assertEquals(sectionId, result.sectionInfo.id)
        assertEquals("Mock Section", result.sectionInfo.title)
        assertEquals(100, result.sectionInfo.availablePoints)
        assertEquals(3600, result.sectionInfo.availableSeconds)
        assertEquals(2, result.assignments.size)
        assertEquals(listOf(solvedAssignmentDTO1, solvedAssignmentDTO2), result.assignments)

        verify(exactly = 1) { sectionRepository.findById(sectionId) }
        verify(exactly = 1) { assignmentFetchService.fetchAssignment(solvedAssignment1.assignment!!, "mockCommitHash") }
        verify(exactly = 1) { assignmentFetchService.fetchAssignment(solvedAssignment2.assignment!!, "mockCommitHash") }
        verify(exactly = 1) { solvedAssignmentReadConverter.toDTO(solvedAssignment1, question1) }
        verify(exactly = 1) { solvedAssignmentReadConverter.toDTO(solvedAssignment2, question2) }
    }

}