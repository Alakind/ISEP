package dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A mapping of answer objects to question IDs")
class SolutionUpdateDTO : HashMap<Int, AnswerUpdateDTO>()
