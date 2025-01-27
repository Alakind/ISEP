package dto.invite

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An invite to an applicant")
data class PreInfoReadDTO(
    val name: String,
    val availableSeconds: Long,
) : ReadDTO