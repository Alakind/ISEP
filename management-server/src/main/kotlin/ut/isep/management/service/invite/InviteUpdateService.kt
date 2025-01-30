package ut.isep.management.service.invite

import dto.invite.InviteUpdateDTO
import enumerable.InviteStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import parser.question.MultipleChoiceQuestion
import ut.isep.management.exception.NotAllowedUpdateException
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.SolvedAssignmentMultipleChoice
import ut.isep.management.service.UpdateService
import ut.isep.management.service.assignment.AssignmentFetchService
import ut.isep.management.service.converter.UpdateConverter
import java.time.OffsetDateTime
import java.util.*

@Service
class InviteUpdateService(
    repository: JpaRepository<Invite, UUID>,
    converter: UpdateConverter<Invite, InviteUpdateDTO>,
    val fetchService: AssignmentFetchService,
    val inviteReadService: InviteReadService,
) : UpdateService<Invite, InviteUpdateDTO, UUID>(repository, converter) {

    fun checkStatusChange(inviteUpdateDTO: InviteUpdateDTO) {
        val status = inviteUpdateDTO.status
        val invite = repository.findById(inviteUpdateDTO.id).orElseThrow { NoSuchElementException("Invite not found") }
        when (status) {
            InviteStatus.not_started -> throw NotAllowedUpdateException("Not started is start state and can't be reset")
            InviteStatus.app_reminded_once, InviteStatus.app_reminded_twice -> {}
            InviteStatus.expired -> throw NotAllowedUpdateException("Expiration status change is not allowed")
            InviteStatus.app_started -> throw NotAllowedUpdateException("Start of assessment is done via /{id}/assessment")
            InviteStatus.app_finished -> {
                if (invite.status != InviteStatus.app_finished) {
                    invite.assessmentFinishedAt = OffsetDateTime.now()
                    repository.save(invite)
                } else {
                    throw NotAllowedUpdateException("Assessment has already been finished")
                }
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

    fun startAutoScoring(inviteUpdateDTO: InviteUpdateDTO) {
        val invite = repository.findById(inviteUpdateDTO.id).orElseThrow { NoSuchElementException("Invite not found") }

        // Multiple choice auto scorable other assignments aren't
        invite.solutions.forEach { solution ->
            val commitHash = inviteReadService.getAssessmentByInviteId(inviteUpdateDTO.id).commit
            val fetchedQuestion = fetchService.fetchAssignment(solution.assignment!!, commitHash)
            when (fetchedQuestion) {
                is MultipleChoiceQuestion -> {
                    if (solution is SolvedAssignmentMultipleChoice) {
                        val userAnswers = solution.userOptionsMarkedCorrect.toSet()
                        val correctAnswers = fetchedQuestion.options.filter{it.isCorrect}.map{it.text}

                        // Assign full points if only all the correct answers are given
                        if (userAnswers.size == correctAnswers.size && correctAnswers.toSet() == userAnswers.toSet()) {
                            solution.scoredPoints = solution.assignment!!.availablePoints!!
                        } else {
                            solution.scoredPoints = 0
                        }
                    }
                }
                else -> {}
            }
        }
    }
}