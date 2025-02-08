package ut.isep.management.service.solution

import dto.testresult.TestResultUpdateDTO
import org.springframework.stereotype.Service
import ut.isep.management.repository.TestResultRepository

@Service
class TestResultUpdateService(
    private val repository: TestResultRepository,
) {
    fun update(updateDTO: TestResultUpdateDTO) {
        val existingTestResult = repository.findById(updateDTO.id).orElseThrow {
            NoSuchElementException("No existing test result for assignment ID: ${updateDTO.id}")
        }

        require(updateDTO.inviteId == existingTestResult.solvedAssignmentCoding?.invite?.id) {
            throw UnsupportedOperationException("Cannot update testResults that don't belong to your invite")
        }
        require(updateDTO.assignmentId == existingTestResult.solvedAssignmentCoding?.assignment?.id) {
            throw UnsupportedOperationException("Cannot update testResults that don't belong to your assignment")
        }

        if (updateDTO.name != null) {
            existingTestResult.name = updateDTO.name!!
        }
        existingTestResult.message = updateDTO.message
        if (updateDTO.passed != null) {
            existingTestResult.passed = updateDTO.passed!!
        }

        repository.save(existingTestResult)
    }
}