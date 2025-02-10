package dto.execution

import dto.CreateDTO
import dto.ReadDTO

data class TestResultDTO (
    val name: String,
    val result: String,
    val passed: Boolean,
) : ReadDTO, CreateDTO