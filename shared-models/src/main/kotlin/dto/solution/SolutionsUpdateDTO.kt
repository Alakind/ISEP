package dto.solution

import dto.CreateDTO
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "A mapping of answer objects to question IDs")
class SolutionsUpdateDTO : HashMap<String, SolvedAssignmentCreateReadDTO>(), CreateDTO
