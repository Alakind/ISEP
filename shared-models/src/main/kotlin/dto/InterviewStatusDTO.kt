package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A mapping of section ids to a boolean indicating whether they have been completed")
data class InterviewStatusDTO (
    val status: Map<Long, Boolean> //Section ID, Completed?
)