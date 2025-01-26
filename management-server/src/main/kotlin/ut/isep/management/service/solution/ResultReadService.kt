package ut.isep.management.service.solution

import dto.assignment.ResultAssignmentReadDTO
import dto.scorecomparison.ScoreComparisonReadDTO
import dto.section.ResultSectionReadDTO
import dto.section.ResultSectionSimpleReadDTO
import dto.section.SectionInfo
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.Section
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentId
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.solution.ResultAssignmentReadConverter
import ut.isep.management.service.invite.InviteReadService
import java.util.*

@Transactional
@Service
class ResultReadService(
    repository: SolvedAssignmentRepository,
    converter: ResultAssignmentReadConverter,
    val inviteRepository: InviteRepository,
    val sectionRepository: SectionRepository,
    val assessmentRepository: AssessmentRepository,
    private val inviteReadService: InviteReadService
) : ReadService<SolvedAssignment, ResultAssignmentReadDTO, SolvedAssignmentId>(repository, converter) {

    fun getResultSection(inviteId: UUID, sectionId: Long): ResultSectionReadDTO {
        val invite = inviteRepository.findById(inviteId).orElseThrow { NoSuchElementException("No invite with ID: $inviteId") }

        val section = sectionRepository.findById(sectionId)
            .orElseThrow { NoSuchElementException("No section with ID: $sectionId") }
        val solvedAssignments = getSolvedAssignments(inviteId, section)
        return createResultDTO(solvedAssignments, section, invite)
    }

    private fun getSolvedAssignments(inviteId: UUID, section: Section): List<SolvedAssignment> {
        // Look for solved versions of all assignments of the section
        return section.assignments.mapNotNull { assignment ->
            repository.findByIdOrNull(SolvedAssignmentId(inviteId, assignment.id))
        }
    }

    private fun createResultDTO(assignments: List<SolvedAssignment>, section: Section, invite: Invite): ResultSectionReadDTO {
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = assignments.map { converter.toDTO(it) }
        return ResultSectionReadDTO(
            SectionInfo(
                id = section.id,
                title = section.title!!,
                availablePoints = section.availablePoints,
                availableSeconds = section.availableSeconds,
            ),
            assignments = assignmentDTOs,
            scoredPoints = assignmentDTOs.mapNotNull { it.scoredPoints }.ifEmpty { null }?.sum(),
            measuredSeconds = invite.measuredSecondsPerSection.find { measuredTimeSection -> measuredTimeSection.section == section }?.seconds
        )
    }

    private fun createSimpleResultDTO(assignments: List<SolvedAssignment>, section: Section, invite: Invite): ResultSectionSimpleReadDTO {
        // Look for solved versions of all assignments of the section
        val assignmentDTOs = assignments.map { converter.toDTO(it) }
        return ResultSectionSimpleReadDTO(
            title = section.title!!,
            availablePoints = section.availablePoints,
            scoredPoints = assignmentDTOs.mapNotNull { it.scoredPoints }.ifEmpty { null }?.sum(),
            availableSeconds = section.availableSeconds,
            measuredSeconds = invite.measuredSecondsPerSection.find { measuredTimeSection -> measuredTimeSection.section == section }?.seconds
        )
    }

    fun getResultByAssessment(inviteId: UUID, assessmentId: Long): List<ResultSectionSimpleReadDTO> {
        val invite = inviteRepository.findById(inviteId).orElseThrow { NoSuchElementException("No invite with ID: $inviteId") }

        val assessment = assessmentRepository.findById(assessmentId).orElseThrow { NoSuchElementException("No assessment with ID: $assessmentId") }
        return assessment.sections.map { section ->
            val solvedAssignments = getSolvedAssignments(inviteId, section)
            createSimpleResultDTO(solvedAssignments, section, invite)
        }
    }

    fun computeScoreComparison(inviteId: UUID): ScoreComparisonReadDTO {
        //FIXME: refactor to having a database with computed percentages after the finished assessment has been auto scored
        // and update the percentage when scores updates to prevent from having to recalculate these values. With large datasets
        // this will be become too much to be computed in the way down below

        // Determine the invite percentage of the selected invite
        val selectedInvite = inviteRepository.findById(inviteId).orElseThrow { NoSuchElementException("No invite with ID: $inviteId") }
        val invitePercentage = selectedInvite.solutions.mapNotNull { it.scoredPoints }.sum().toFloat() / selectedInvite.assessment!!.availablePoints * 100;

        // Retrieve the valid percentages of all invites
        val allInvites: List<Invite> = inviteRepository.findAll().toList()
        val validPercentages = getValidPercentages(allInvites)

        // Calculate the percentage of invites the current invite percentage is better than
        val betterScores = validPercentages.count { it < invitePercentage }
        val betterThanPercentage = if (validPercentages.isNotEmpty()) {
            (betterScores.toFloat() / validPercentages.size) * 100
        } else {
            0f
        }

        // Create the distribution groups with data
        val distributionGroups = getDistributionGroups(validPercentages)

        // Determine the distribution group for specified invite percentage
        val selectedGroup = getSelectedDistributionGroup(invitePercentage)

        // Normalize the distributionGroups to 100%
        val normDistributionGroups = distributionGroups.map { it.div(validPercentages.size.toFloat()) * 100 }

        return ScoreComparisonReadDTO(
            percentage = betterThanPercentage,
            distributionGroups = normDistributionGroups,
            selectedGroup = selectedGroup
        )
    }

    private fun getDistributionGroups(validPercentages: List<Float>): MutableList<Int> {
        val distributionGroups = MutableList(10) { 0 }

        validPercentages.forEach { score ->
            val groupIndex = getSelectedDistributionGroup(score)
            if (groupIndex != -1) distributionGroups[groupIndex]++
        }
        return distributionGroups
    }

    private fun getSelectedDistributionGroup(percentage: Float): Int {
        return when (percentage) {
            in 0.00..<10.00 -> 0
            in 10.00..<20.00 -> 1
            in 20.00..<30.00 -> 2
            in 30.00..<40.00 -> 3
            in 40.00..<50.00 -> 4
            in 50.00..<60.00 -> 5
            in 60.00..<70.00 -> 6
            in 70.00..<80.00 -> 7
            in 80.00..<90.00 -> 8
            in 90.00..100.00 -> 9
            else -> -1
        }
    }

    //.filter { it.status == InviteStatus.app_finished }
    private fun getValidPercentages(allInvites: List<Invite>) = allInvites.mapNotNull { invite ->
        val availablePoints = invite.assessment!!.availablePoints
        val totalScoredPoints = invite.solutions.mapNotNull { it.scoredPoints }.sum()

        if (availablePoints > 0) {
            (totalScoredPoints.toFloat() / availablePoints) * 100
        } else {
            null
        }
    }


}
