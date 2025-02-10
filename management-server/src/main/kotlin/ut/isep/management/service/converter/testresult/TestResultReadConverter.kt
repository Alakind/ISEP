package ut.isep.management.service.converter.testresult

import dto.testresult.TestResultCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.ReadConverter

@Component
class TestResultReadConverter : ReadConverter<TestResult, TestResultCreateReadDTO> {
    override fun toDTO(entity: TestResult): TestResultCreateReadDTO {
        return TestResultCreateReadDTO(
            name = entity.name,
            passed = entity.passed,
            message = entity.message,
        )
    }
}
