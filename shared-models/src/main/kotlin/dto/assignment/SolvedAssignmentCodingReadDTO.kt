package dto.assignment

import dto.solution.AnswerCreateReadDTO
import io.swagger.v3.oas.annotations.media.Schema
import java.net.URI

@Schema(description = "Solved coding assignment")
data class SolvedAssignmentCodingReadDTO(
    override val id: Long,
    override val type: AssignmentReadDTO.AssignmentType = AssignmentReadDTO.AssignmentType.Coding,
    override val description: String,
    val codeUri: URI,
    val language: String,
    override val answer: AnswerCreateReadDTO.Coding
) : SolvedAssignmentReadDTO()
