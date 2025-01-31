package dto.timing

import dto.UpdateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An timing update for measured time of section in seconds")
data class TimingPerSectionInSecondsUpdateDTO(
    override val id: Long, // sectionId
    val seconds: Long?,
) : UpdateDTO<Long>