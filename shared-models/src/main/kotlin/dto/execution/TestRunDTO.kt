package dto.execution

data class TestRunDTO(
    val code: String,
    val codeFileName: String?,
    val test: String?,
    val testFileName: String?
)