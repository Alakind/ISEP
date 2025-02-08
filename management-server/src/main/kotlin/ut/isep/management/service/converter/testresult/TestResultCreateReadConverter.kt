package ut.isep.management.service.converter.testresult

import dto.testresult.TestResultCreateReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TestResult
import ut.isep.management.service.converter.CreateConverter
import ut.isep.management.service.converter.ReadConverter

@Component
class TestResultCreateReadConverter : CreateConverter<TestResult, TestResultCreateReadDTO>, ReadConverter<TestResult, TestResultCreateReadDTO> {
    override fun toDTO(entity: TestResult): TestResultCreateReadDTO {
        return TestResultCreateReadDTO(
            name = entity.name,
            passed = entity.passed,
            message = entity.message,
        )
    }

    override fun fromDTO(createDTO: TestResultCreateReadDTO): TestResult {
        return TestResult(
            message = createDTO.message,
            name = createDTO.name,
            passed = createDTO.passed,
        )
    }
}