package ut.isep.management.service.converter.testresult

import dto.assignment.TestResultCreateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.CreateConverter

@Component
class TestResultCreateConverter : CreateConverter<TestResult, TestResultCreateDTO> {
    override fun fromDTO(createDTO: TestResultCreateDTO): TestResult {
        return TestResult(
            message = createDTO.message,
            name = createDTO.name,
            passed = createDTO.passed,
        )
    }
}