package models

data class AssignmentCoding(
    val id: Int,
    val text: List<String>,
    val language: String,
    val files: Map<String, ByteArray>
) : Assignment()