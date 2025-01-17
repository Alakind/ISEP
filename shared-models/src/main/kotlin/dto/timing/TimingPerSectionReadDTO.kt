package dto.timing

import dto.ReadDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Timing for section")
data class TimingPerSectionReadDTO(
    val seconds: Long
) : ReadDTO