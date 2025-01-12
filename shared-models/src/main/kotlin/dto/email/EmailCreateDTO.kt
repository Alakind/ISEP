package dto.email

import enumerable.EmailType
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

@Schema(description = "Creating a new email request")
class EmailCreateDTO(
    val applicantId: Long,
    val inviteId: UUID,
    val type: EmailType,
    val additionalMessage: String? = null
)