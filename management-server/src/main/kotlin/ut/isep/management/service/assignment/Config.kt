package ut.isep.management.service.assignment

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Config @JsonCreator constructor(
    @JsonProperty("tag-options")
    val tagOptions: List<String>,
    @JsonProperty("question-options")
    val questionOptions: List<String>,
)