package ut.isep.management.service.converter.invite


import dto.invite.InviteReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.TimingPerSection
import ut.isep.management.service.converter.ReadConverter

@Component
class InviteReadConverter : ReadConverter<Invite, InviteReadDTO> {
    override fun toDTO(entity: Invite): InviteReadDTO {
        return InviteReadDTO(
            id = entity.id,
            applicantId = entity.applicant!!.id,
            assessmentId = entity.assessment!!.id,
            invitedAt = entity.invitedAt,
            expiresAt = entity.expiresAt,
            measuredSecondsPerSection = entity.measuredSecondsPerSection.map { timingPerSection: TimingPerSection -> timingPerSection.seconds },
            status = entity.status,
            assessmentStartedAt = entity.assessmentStartedAt,
            assessmentFinishedAt = entity.assessmentFinishedAt
        )
    }
}
