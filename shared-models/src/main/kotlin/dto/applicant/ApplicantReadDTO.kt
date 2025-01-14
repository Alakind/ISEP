package dto.applicant

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime
import java.util.*

@Schema(description = "DTO for creating an Applicant")
data class ApplicantReadDTO(
    val id: Long = 0,
    val name: String,
    val email: String,
    val preferredLanguage: String?,
    val score: Int?,
    val invites: List<UUID>,
    val createdAt: OffsetDateTime,
) : ReadDTO