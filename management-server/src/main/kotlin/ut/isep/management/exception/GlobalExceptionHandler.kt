package ut.isep.management.exception

import org.springframework.data.mapping.PropertyReferenceException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.mail.MailSendException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@ControllerAdvice
class GlobalExceptionHandler {

    /**
     * This exception can be caused when the entity can't be found in the repository.
     * */
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(ex: NoSuchElementException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)
    }

    /**
     * This exception can be caused during runtime.
     * */
    @ExceptionHandler(HttpClientErrorException::class)
    fun handleHttpClientErrorException(ex: HttpClientErrorException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)
    }

    /**
     * This exception can be caused during runtime.
     * */
    @ExceptionHandler(PropertyReferenceException::class)
    fun handlePropertyReferenceException(ex: PropertyReferenceException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.controller.InviteController.getInvites]
     * */
    @ExceptionHandler(EndDateBeforeStartDateException::class)
    fun handleEndDateBeforeStartDateException(ex: EndDateBeforeStartDateException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.timing.TimingPerSectionUpdateService.setMeasuredSecondsPreviousSection]
     * */
    @ExceptionHandler(TooManyRegisteredTimedObjectsException::class)
    fun handleTooManyRegisteredTimedObjectsException(ex: TooManyRegisteredTimedObjectsException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.invite.InviteReadService.checkAccessibilityAssessment]
     * */
    @ExceptionHandler(AssessmentTimeExceededException::class)
    fun handleAssessmentTimeExceedException(ex: AssessmentTimeExceededException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.invite.InviteReadService.checkAccessibilityAssessment]
     * */
    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorizedException(ex: UnauthorizedException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.message)
    }

    /**
     * This exception can be caused when a invalid enum type is provided for the
     * [ut.isep.management.controller.InviteController.getInvites] endpoint
     * for the invite status or any other enum.
     * */
    @ExceptionHandler(MethodArgumentTypeMismatchException::class) //includes ConversionFailedException
    fun handleConversionConflict(ex: MethodArgumentTypeMismatchException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.invite.InviteUpdateService.checkStatusChange]
     * */
    @ExceptionHandler(NotAllowedUpdateException::class)
    fun handleNotAllowedUpdateException(ex: NotAllowedUpdateException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by require methods.
     * */
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(ex: IllegalArgumentException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.user.UserReadService.getByOid]
     * */
    @ExceptionHandler(OidNotUniqueException::class)
    fun handleOidNotUniqueException(ex: OidNotUniqueException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.email.MailSenderService.getSubjectGeneral]
     * - [ut.isep.management.service.email.MailSenderService.sendMail]
     * - [ut.isep.management.service.email.MailSenderService.getTemplate]
     * */
    @ExceptionHandler(MailSendException::class)
    fun handleMailSendException(ex: MailSendException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)
    }

    /**
     * This exception can be caused by check methods.
     * */
    @ExceptionHandler(IllegalStateException::class)
    fun handleIllegalStateException(ex: IllegalStateException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.timing.TimingPerSectionUpdateService.getMeasuredTimeEntity]
     * - [ut.isep.management.service.solution.SolutionUpdateService.updateSolutions]
     * - [ut.isep.management.service.solution.ResultUpdateService.updateAssignment]
     * - [ut.isep.management.service.solution.TestResultUpdateService.update]
     * */
    @ExceptionHandler(UnsupportedOperationException::class)
    fun handleUnsupportedOperationException(ex: UnsupportedOperationException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.message)
    }

    /**
     * This exception can be caused by the following:
     * - [ut.isep.management.service.timing.TimingPerSectionReadService.getTimeLeft]
     * */
    @ExceptionHandler(NoSuchFieldException::class)
    fun handleNoSuchFieldException(ex: NoSuchFieldException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.message)
    }
}