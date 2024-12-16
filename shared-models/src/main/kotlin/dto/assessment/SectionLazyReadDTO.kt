package dto.assessment

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A section object containing metadata, but not the actual assignments")
data class SectionLazyReadDTO(
    val id: Long,
    val title: String,
    val size: Int
) : ReadDTO