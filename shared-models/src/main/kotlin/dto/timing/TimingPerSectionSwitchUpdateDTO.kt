package dto.timing

import dto.UpdateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An timing update for measured time of section when switching to different section")
data class TimingPerSectionSwitchUpdateDTO(
    override val id: Long,
    val seconds: Long?,
) : UpdateDTO<Long>