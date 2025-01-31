package ut.isep.management.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class NotAllowedUpdateException(message: String) : RuntimeException(message)