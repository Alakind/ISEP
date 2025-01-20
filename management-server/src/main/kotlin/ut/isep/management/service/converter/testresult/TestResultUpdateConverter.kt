package ut.isep.management.service.converter.testresult

import dto.assignment.TestResultUpdateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.UpdateConverter

@Component
class TestResultUpdateConverter : UpdateConverter<TestResult, TestResultUpdateDTO> {
    override fun updateEntity(entity: TestResult, updateDTO: TestResultUpdateDTO): TestResult {
        return entity.apply {
            updateDTO.name?.let { this.name = it }
            updateDTO.passed?.let { this.passed = it }
            updateDTO.message?.let { this.message = it }
        }
    }
}
