package ut.isep.management.controller

import dto.section.ResultSectionSimpleReadDTO
import dto.section.ResultSectionReadDTO
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ut.isep.management.service.solution.ResultReadService
import java.util.*

@RestController
@Tag(name = "Result")
class ResultController(
    val solutionReadService: ResultReadService,
) {
    @GetMapping("section/{sectionId}/result/{inviteId}")
    fun getResultsBySection(
        @PathVariable sectionId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<ResultSectionReadDTO> {
        return try {
            ResponseEntity.ok(solutionReadService.getResultSection(inviteId, sectionId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("assessment/{assessmentId}/result/{inviteId}")
    fun getResultByAssessment(
        @PathVariable assessmentId: Long,
        @PathVariable inviteId: UUID
    ): ResponseEntity<List<ResultSectionSimpleReadDTO>> {
        return try {
            ResponseEntity.ok(solutionReadService.getResultByAssessment(inviteId, assessmentId))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }
}
