package dto.assignment

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test result for a solved assignment")
data class TestResultReadDTO(
    val name: String,
    val passed: Boolean,
    val message: String?,
) : ReadDTO