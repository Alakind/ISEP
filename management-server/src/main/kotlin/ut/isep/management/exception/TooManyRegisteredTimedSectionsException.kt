package ut.isep.management.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class TooManyRegisteredTimedSectionsException(override val message: String) : RuntimeException(message)