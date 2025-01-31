package ut.isep.management.controller;

import dto.email.EmailCreateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ut.isep.management.service.email.MailSenderService

@RestController
@RequestMapping("/send-email")
@Tag(name = "Email")
class EmailController(
    val emailService: MailSenderService
) {

    @PostMapping
    @Operation(
        summary = "Send an email message",
        description = "Send an email message via Gmail account" +
                "\nExtra info:" +
                "\n- Handles sending the email asynchronously"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Email has been submitted for queueing",
            ),
            ApiResponse(
                responseCode = "400",
                description = "Email type is invalid",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Email hasn't been submitted for queueing, because applicant or invite not found or Provided invite does not belong to applicant",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun sendMail(@RequestBody emailCreateDTO: EmailCreateDTO): ResponseEntity<String> {
        val (applicant, invite) = emailService.checkData(emailCreateDTO)
        emailService.sendMail(emailCreateDTO, applicant, invite)
        return ResponseEntity.ok("Email request has been received")
    }
}
