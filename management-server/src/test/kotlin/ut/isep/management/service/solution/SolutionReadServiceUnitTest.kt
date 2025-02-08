package ut.isep.management.service.solution

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.repository.findByIdOrNull
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
    @Disabled
    fun `test getSolvedSection() that correct SolvedSectionReadDTO is returned`() {

    }

}