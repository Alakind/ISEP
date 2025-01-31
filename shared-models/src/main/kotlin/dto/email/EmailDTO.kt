package dto.email;

import enumerable.EmailType
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "An email, consisting of to, subject and body")
data class EmailDTO(
    val to: String,
    val subject: String,
    val inviteLink: String,
    val expirationDate: String,
    val timeLeft: String,
    val type: EmailType,
    val additionalMessage: String
)
