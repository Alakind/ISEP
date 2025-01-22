package ut.isep.management.repository

import org.springframework.stereotype.Repository
import ut.isep.management.model.entity.TestResult

@Repository
interface TestResultRepository : BaseRepository<TestResult, Long>