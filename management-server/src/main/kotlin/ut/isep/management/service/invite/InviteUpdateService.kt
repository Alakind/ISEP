package ut.isep.management.service.invite

import dto.invite.InviteUpdateDTO
import enumerable.InviteStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.Invite
import ut.isep.management.service.UpdateService
import ut.isep.management.service.converter.UpdateConverter
import java.time.OffsetDateTime
import java.util.*

@Service
class InviteUpdateService(
    repository: JpaRepository<Invite, UUID>,
    converter: UpdateConverter<Invite, InviteUpdateDTO>
) : UpdateService<Invite, InviteUpdateDTO, UUID>(repository, converter) {

    fun checkStatusChange(inviteUpdateDTO: InviteUpdateDTO) {
        val status = inviteUpdateDTO.status
        val invite = repository.findById(inviteUpdateDTO.id).orElseThrow { NoSuchElementException("Invite not found") }
        when (status) {
            InviteStatus.not_started -> throw NotAllowedUpdateException("Not started is start state and can't be reset")
            InviteStatus.app_reminded_once -> throw NotAllowedUpdateException("This is set via /send-email")
            InviteStatus.app_reminded_twice -> throw NotAllowedUpdateException("This is set via /send-email")
            InviteStatus.expired -> throw NotAllowedUpdateException("Expiration status change is not allowed")
            InviteStatus.app_started -> throw NotAllowedUpdateException("Start of assessment is done via /{id}/assessment")
            InviteStatus.app_finished -> {
                invite.assessmentFinishedAt = OffsetDateTime.now()
                repository.save(invite)
            }

            InviteStatus.cancelled -> {
                if (invite.status == InviteStatus.app_finished) {
                    throw NotAllowedUpdateException("Finished assessments can't be cancelled")
                }
            }

            null -> {
                return
            }
        }
    }
}