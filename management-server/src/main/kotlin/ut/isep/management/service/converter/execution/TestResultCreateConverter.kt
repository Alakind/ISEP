package ut.isep.management.service.converter.execution

import dto.execution.TestResultDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.CreateConverter

@Component
class TestResultCreateConverter: CreateConverter<TestResult, TestResultDTO> {
    override fun fromDTO(createDTO: TestResultDTO): TestResult {
        return TestResult(
            name = createDTO.name,
            message = createDTO.result,
            passed = createDTO.passed
        )
    }
}