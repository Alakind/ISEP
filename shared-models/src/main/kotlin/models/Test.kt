package models

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A test, consisting of multiple Sections")
data class Test(
    val id: Int?,
    val sections: List<Section>
)