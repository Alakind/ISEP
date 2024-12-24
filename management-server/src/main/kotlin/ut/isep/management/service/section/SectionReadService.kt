package ut.isep.management.service.section

import dto.section.SectionReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Section
import ut.isep.management.repository.SectionRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.section.SectionReadConverter


@Service
class SectionReadService(
    repository: SectionRepository,
    converter: SectionReadConverter
) : ReadService<Section, SectionReadDTO, Long>(repository, converter)