package ut.isep.management.service.solution

import dto.assignment.TestResultCreateDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.model.entity.SolvedAssignmentCoding
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.model.entity.TestResult
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.repository.TestResultRepository

@Service
class TestResultCreateService(
    private val repository: TestResultRepository,
    private val solvedAssignmentRepository: SolvedAssignmentRepository,
) {
    @Transactional
    fun create(createDto: TestResultCreateDTO): TestResult {
        val key = SolvedAssignmentId(createDto.inviteId, createDto.assignmentId)
        val solvedAssignment: SolvedAssignmentCoding = solvedAssignmentRepository.findById(key)
            .orElseThrow { NoSuchElementException("Solved assignment not found") }
            .let { it as? SolvedAssignmentCoding ?: throw ClassCastException("Expected SolvedAssignmentCoding but found ${it::class.simpleName}") }

        // Create the test result
        val testResult = TestResult.createTestResult(name = createDto.name, message = createDto.message, passed = createDto.passed, solvedAssignmentCoding = solvedAssignment)
        val savedTestResult = repository.save(testResult)

        // Update the solvedAssignment with the new test result
        solvedAssignment.apply {
            this.testResults.add(savedTestResult)
            solvedAssignmentRepository.save(this)
        }
        return savedTestResult
    }
}