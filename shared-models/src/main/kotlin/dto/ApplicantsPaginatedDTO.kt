package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description="Paginated list of applicants")
data class ApplicantsPaginatedDTO(
    val total: Long,
    val applicants: List<ApplicantReadDTO>
)
