package ut.isep.management.service.converter.testresult

import dto.assignment.TestResultReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.ReadConverter

@Component
class TestResultReadConverter : ReadConverter<TestResult, TestResultReadDTO> {
    override fun toDTO(entity: TestResult): TestResultReadDTO {
        return TestResultReadDTO(
            name = entity.name,
            passed = entity.passed,
            message = entity.message,
        )
    }
}
