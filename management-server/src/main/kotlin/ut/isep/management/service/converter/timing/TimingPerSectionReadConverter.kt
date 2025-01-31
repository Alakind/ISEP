package ut.isep.management.service.converter.timing

import dto.timing.TimingPerSectionReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.service.converter.ReadConverter

@Component
class TimingPerSectionReadConverter : ReadConverter<TimingPerSection, TimingPerSectionReadDTO> {
    override fun toDTO(entity: TimingPerSection): TimingPerSectionReadDTO {
        return TimingPerSectionReadDTO(
            seconds = entity.seconds,
        )
    }
}