package ut.isep.management.service.solution

import dto.assignment.ResultAssignmentMultipleChoiceReadDTO
import dto.assignment.ResultAssignmentOpenReadDTO
import dto.assignment.SolvedAssignmentMultipleChoiceReadDTO
import dto.assignment.SolvedAssignmentOpenReadDTO
import dto.scorecomparison.ScoreComparisonReadDTO
import dto.section.ResultSectionReadDTO
import dto.section.ResultSectionSimpleReadDTO
import dto.section.SectionInfo
import dto.solution.AnswerCreateReadDTO
import enumerable.InviteStatus
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.repository.findByIdOrNull
import parser.question.MultipleChoiceQuestion
import parser.question.OpenQuestion
import parser.question.Question
import reactor.core.publisher.Mono
import ut.isep.management.model.entity.*
import ut.isep.management.repository.AssessmentRepository
import ut.isep.management.repository.InviteRepository
import ut.isep.management.repository.SectionRepository
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.assignment.AsyncAssignmentFetchService
import ut.isep.management.service.converter.solution.ResultAssignmentReadConverter
import java.util.*

class ResultReadServiceUnitTest {
    private val solvedAssignmentRepository: SolvedAssignmentRepository = mockk()
    private val resultAssignmentReadConverter: ResultAssignmentReadConverter = mockk()
    private val assignmentFetchService: AsyncAssignmentFetchService = mockk()
    private val inviteRepository: InviteRepository = mockk()
    private val sectionRepository: SectionRepository = mockk()
    private val assessmentRepository: AssessmentRepository = mockk()
    private val resultReadService: ResultReadService =
        ResultReadService(solvedAssignmentRepository, resultAssignmentReadConverter, assignmentFetchService, inviteRepository, sectionRepository, assessmentRepository)

    private val assessment1 = Assessment(id = 1L, gitCommitHash = "sdfjosdosijvoisnvonm")

    private val inviteId1 = UUID.randomUUID()
    private val invite1 = Invite(id = inviteId1, assessment = assessment1)

    private val assignment1 = Assignment(id = 1L, availablePoints = 100, availableSeconds = 300, assignmentType = AssignmentType.OPEN)
    private val assignment2 = Assignment(id = 2L, availablePoints = 100, availableSeconds = 500, assignmentType = AssignmentType.MULTIPLE_CHOICE)
    private val section1 = Section(id = 1L, title = "Section 1", assessment = assessment1, assignments = mutableListOf(assignment1, assignment2))

    private val solvedAssignment1 = SolvedAssignmentOpen(SolvedAssignmentId(inviteId1, assignment1.id), invite1, assignment1, "this is the user answer").apply { scoredPoints = 80 }
    private val solvedAssignment2 = SolvedAssignmentMultipleChoice(SolvedAssignmentId(inviteId1, assignment2.id), invite1, assignment2, listOf("Option 1", "Option 2")).apply { scoredPoints = 90 }
    private val solvedAssignment1ReadDTO = SolvedAssignmentOpenReadDTO(solvedAssignment1.id.assignmentId, "This is an open question", AnswerCreateReadDTO.Open(solvedAssignment1.userSolution))
    private val solvedAssignment2ReadDTO = SolvedAssignmentMultipleChoiceReadDTO(
        solvedAssignment2.id.assignmentId, "This is an mc question", listOf("Option 1", "Option 2", "option 3"), true,
        AnswerCreateReadDTO
            .MultipleChoice(solvedAssignment2.userOptionsMarkedCorrect)
    )

    private val question1 = OpenQuestion(
        id = 1L,
        tags = listOf("assessment 1"),
        description = solvedAssignment1ReadDTO.description,
        filePath = "/open1",
        availablePoints = assignment1.availablePoints!!,
        availableSeconds = assignment1.availableSeconds!!,
        referenceAnswer = solvedAssignment1.userSolution
    )
    private val question2 = MultipleChoiceQuestion(
        id = 2L,
        filePath = "/mc2",
        tags = listOf("assessment 1"),
        description = "This is an mc question",
        availablePoints = assignment2.availablePoints!!,
        availableSeconds = assignment2.availableSeconds!!,
        options = listOf(
            MultipleChoiceQuestion.Option(solvedAssignment2ReadDTO.options[0], true),
            MultipleChoiceQuestion.Option(solvedAssignment2ReadDTO.options[1], false),
            MultipleChoiceQuestion.Option(solvedAssignment2ReadDTO.options[2], true)
        )
    )

    private val assignmentDTO1 = ResultAssignmentOpenReadDTO(solvedAssignment1ReadDTO, AnswerCreateReadDTO.Open("This is a reference answer"), 80, 100)
    private val assignmentDTO2 = ResultAssignmentMultipleChoiceReadDTO(solvedAssignment2ReadDTO, AnswerCreateReadDTO.MultipleChoice(listOf("option 1", "option 3")), 90, 100)


    private val resultSection1SimpleReadDTO = ResultSectionSimpleReadDTO(
        title = section1.title!!,
        availablePoints = section1.availablePoints,
        scoredPoints = 170,
        availableSeconds = section1.availableSeconds,
        measuredSeconds = null
    )

    @Test
    fun `test getResultSection() that NoSuchElementException is thrown when invite can't be found`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultReadService.getResultSection(inviteId1, section1.id)
        }
        assertThat(exception.message).isEqualTo("No invite with ID: $inviteId1")
    }

    @Test
    fun `test getResultSection() that NoSuchElementException is thrown when section can't be found`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)
        every { sectionRepository.findById(section1.id) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultReadService.getResultSection(inviteId1, section1.id)
        }
        assertThat(exception.message).isEqualTo("No section with ID: ${section1.id}")
    }

    @Test
    fun `test getResultSection() that converted resultSectionReadDTO is returned`() {
        val resultSectionReadDTO = ResultSectionReadDTO(
            SectionInfo(
                id = section1.id,
                title = section1.title!!,
                availablePoints = section1.availablePoints,
                availableSeconds = section1.availableSeconds,
            ),
            assignments = emptyList(),
            scoredPoints = null,
            measuredSeconds = null
        )

        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)
        every { sectionRepository.findById(section1.id) } returns Optional.of(section1)
        every { solvedAssignmentRepository.findById(any()) } returns Optional.empty()

        val result = resultReadService.getResultSection(inviteId1, section1.id)

        assertThat(result).isEqualTo(resultSectionReadDTO)

        verify { inviteRepository.findById(inviteId1) }
        verify { sectionRepository.findById(section1.id) }
        verify { solvedAssignmentRepository.findById(any()) }
    }


    @Test
    fun `test getSolvedAssignments() that all SolvedAssignment are returned`() {
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment1.id)) } returns solvedAssignment1
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment2.id)) } returns solvedAssignment2

        val getSolvedAssignments = resultReadService.javaClass.getDeclaredMethod("getSolvedAssignments", UUID::class.java, Section::class.java)
        getSolvedAssignments.isAccessible = true

        val result = getSolvedAssignments.invoke(resultReadService, inviteId1, section1) as List<SolvedAssignment>

        assertThat(result).containsExactlyInAnyOrder(solvedAssignment1, solvedAssignment2)

        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment1.id)) }
        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment2.id)) }
    }

    @Test
    fun `test getSolvedAssignments() returns empty list when no solved assignments exist`() {
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment1.id)) } returns null
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment2.id)) } returns null

        val getSolvedAssignments = resultReadService.javaClass.getDeclaredMethod("getSolvedAssignments", UUID::class.java, Section::class.java)
        getSolvedAssignments.isAccessible = true

        val result = getSolvedAssignments.invoke(resultReadService, inviteId1, section1) as List<SolvedAssignment>

        assertThat(result).isEmpty()

        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment1.id)) }
        verify { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment2.id)) }
    }


    @Test
    fun `test createResultDTO returns expected ResultSectionReadDTO`() {
        every { assignmentFetchService.fetchAssignment(assignment1, any<String>()) } returns Mono.just(question1)
        every { assignmentFetchService.fetchAssignment(assignment2, any<String>()) } returns Mono.just(question2)
        every { resultAssignmentReadConverter.toDTO(solvedAssignment1, question1) } returns assignmentDTO1
        every { resultAssignmentReadConverter.toDTO(solvedAssignment2, question2) } returns assignmentDTO2

        val createResultDTO = resultReadService.javaClass.getDeclaredMethod("createResultDTO", List::class.java, Section::class.java, Invite::class.java)
        createResultDTO.isAccessible = true
        val result = createResultDTO.invoke(resultReadService, listOf(solvedAssignment1, solvedAssignment2), section1, invite1) as ResultSectionReadDTO

        val expectedResult = ResultSectionReadDTO(
            SectionInfo(
                id = section1.id,
                title = section1.title!!,
                availablePoints = section1.availablePoints,
                availableSeconds = section1.availableSeconds,
            ),
            assignments = listOf(assignmentDTO1, assignmentDTO2),
            scoredPoints = 170,
            measuredSeconds = null
        )

        assertThat(result).isEqualTo(expectedResult)

        verify { assignmentFetchService.fetchAssignment(assignment1, any()) }
        verify { assignmentFetchService.fetchAssignment(assignment2, any()) }
        verify { resultAssignmentReadConverter.toDTO(solvedAssignment1, question1) }
        verify { resultAssignmentReadConverter.toDTO(solvedAssignment2, question2) }
    }

    @Test
    fun `test createSimpleResultDTO that ResultSectionSimpleReadDTO is returned`() {
        val createSimpleResultDTO = resultReadService.javaClass.getDeclaredMethod("createSimpleResultDTO", List::class.java, Section::class.java, Invite::class.java)
        createSimpleResultDTO.isAccessible = true
        val result = createSimpleResultDTO.invoke(resultReadService, listOf(solvedAssignment1, solvedAssignment2), section1, invite1) as ResultSectionSimpleReadDTO

        assertThat(result).isEqualTo(resultSection1SimpleReadDTO)
    }

    @Test
    fun `test getResultByAssessment() that NoSuchElementException is thrown when invite can't be found`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultReadService.getResultByAssessment(inviteId1, section1.id)
        }
        assertThat(exception.message).isEqualTo("No invite with ID: $inviteId1")
    }

    @Test
    fun `test getResultByAssessment() that NoSuchElementException is thrown when assessment can't be found`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)
        every { assessmentRepository.findById(assessment1.id) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultReadService.getResultByAssessment(inviteId1, section1.id)
        }
        assertThat(exception.message).isEqualTo("No assessment with ID: ${assessment1.id}")
    }

    @Test
    @Disabled(
        "Missing mocked calls inside every { ... } block: make sure the object inside the block is a mock for the createSimpleResultDTO.invoke() call" +
                "This can't be tested, because private method are not mockable"
    )
    fun `test getResultByAssessment() that converted DTO list is returned`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)
        every { assessmentRepository.findById(assessment1.id) } returns Optional.of(assessment1)

        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment1.id)) } returns solvedAssignment1
        every { solvedAssignmentRepository.findByIdOrNull(SolvedAssignmentId(inviteId1, assignment2.id)) } returns solvedAssignment2

        val createSimpleResultDTO = resultReadService.javaClass.getDeclaredMethod("createSimpleResultDTO", List::class.java, Section::class.java, Invite::class.java)
        createSimpleResultDTO.isAccessible = true

        every { createSimpleResultDTO.invoke(resultReadService, listOf(solvedAssignment1, solvedAssignment2), section1, invite1) } returns resultSection1SimpleReadDTO

        val result = resultReadService.getResultByAssessment(inviteId1, assessment1.id)

        val expectedResult = listOf(resultSection1SimpleReadDTO)

        assertThat(result).isEqualTo(expectedResult)

        verify { inviteRepository.findById(inviteId1) }
        verify { assessmentRepository.findById(assessment1.id) }
    }

    @Test
    fun `test computeScoreComparison() throws NoSuchElementException when invite is not found`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            resultReadService.computeScoreComparison(inviteId1)
        }

        assertThat(exception.message).isEqualTo("No invite with ID: $inviteId1")
    }

    @Test
    fun `test computeScoreComparison() throws IllegalArgumentException when invitePercentage is NaN`() {
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)

        val exception = assertThrows<IllegalArgumentException> {
            resultReadService.computeScoreComparison(inviteId1)
        }

        assertThat(exception.message).isEqualTo("Invite percentage must be a percentage")
    }

    @Test
    fun `test computeScoreComparison() throws IllegalArgumentException when invitePercentage is not between 0 and 100`() {
        val invite1 = Invite(inviteId1).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(SolvedAssignmentId(inviteId1, 1L), this, Assignment(1L, "Assignment 1", AssignmentType.OPEN)).apply { scoredPoints = 80 },
                SolvedAssignmentMultipleChoice(SolvedAssignmentId(inviteId1, 2L), this, Assignment(2L, "Assignment 2", AssignmentType.MULTIPLE_CHOICE)).apply { scoredPoints = 90 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 40), Assignment(availablePoints = 45))))) // Total available points = 100
        }
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)

        val exception = assertThrows<IllegalArgumentException> {
            resultReadService.computeScoreComparison(inviteId1)
        }

        assertThat(exception.message).isEqualTo("Invite percentage must between 0 and 100 (value: 200.0)")
    }

    @Test
    fun `test computeScoreComparison() that correct output is given`() {
        val invite1 = Invite(inviteId1, status = InviteStatus.app_finished).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(SolvedAssignmentId(inviteId1, 1L), this, Assignment(1L, "Assignment 1", AssignmentType.OPEN)).apply { scoredPoints = 80 },
                SolvedAssignmentMultipleChoice(SolvedAssignmentId(inviteId1, 2L), this, Assignment(2L, "Assignment 2", AssignmentType.MULTIPLE_CHOICE)).apply { scoredPoints = 90 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100))))) // Total available points = 200
        }
        val invite2 = Invite(UUID.randomUUID(), status = InviteStatus.app_finished).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(SolvedAssignmentId(UUID.randomUUID(), 3L), this, Assignment(3L, "Assignment 3", AssignmentType.OPEN), "solution 3").apply { scoredPoints = 70 },
                SolvedAssignmentMultipleChoice(SolvedAssignmentId(UUID.randomUUID(), 4L), this, Assignment(4L, "Assignment 4", AssignmentType.MULTIPLE_CHOICE)).apply { scoredPoints = 60 }
            )
            assessment =
                Assessment(2L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100))))) // Total available points = 200
        }

        val invite3 = Invite(UUID.randomUUID(), status = InviteStatus.app_finished).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(SolvedAssignmentId(UUID.randomUUID(), 5L), this, Assignment(5L, "Assignment 5", AssignmentType.OPEN), "solution 5").apply { scoredPoints = 50 },
                SolvedAssignmentMultipleChoice(SolvedAssignmentId(UUID.randomUUID(), 6L), this, Assignment(6L, "Assignment 6", AssignmentType.MULTIPLE_CHOICE)).apply { scoredPoints = 40 },
            )
            assessment =
                Assessment(3L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100))))) // Total available points = 200
        }
        every { inviteRepository.findById(inviteId1) } returns Optional.of(invite1)
        every { inviteRepository.findAll() } returns listOf(invite1, invite2, invite3)

        val invitePercentage = (80 + 90).toFloat() / 200 * 100 // 170/200 * 100 = 85%
        val validPercentages = listOf(
            invitePercentage, // 85% (invite1)
            (70 + 60).toFloat() / 200 * 100, // 130/200 * 100 = 65% (invite2)
            (50 + 40).toFloat() / 200 * 100 // 90/200 * 100 = 45% (invite3)
        )

        val betterThanPercentage = (2.toFloat() / 3) * 100 // (2/3 * 100) = 66.67%

        val distributionGroups = MutableList(10) { 0 }
        validPercentages.forEach { score ->
            val groupIndex = (score / 10 - 1).toInt()
            if (groupIndex != -1) distributionGroups[groupIndex]++
        }

        val normDistributionGroups = distributionGroups.map { it.toFloat() / validPercentages.size * 100 }

        val selectedGroup = (invitePercentage / 10 - 1).toInt()

        val result = resultReadService.computeScoreComparison(inviteId1)

        val expectedResult = ScoreComparisonReadDTO(
            percentage = betterThanPercentage,
            distributionGroups = normDistributionGroups,
            selectedGroup = selectedGroup
        )

        assertThat(result.percentage).isEqualTo(expectedResult.percentage)
        assertThat(result.distributionGroups).containsExactlyElementsOf(expectedResult.distributionGroups)
        assertThat(result.selectedGroup).isEqualTo(expectedResult.selectedGroup)

        verify { inviteRepository.findById(inviteId1) }
        verify { inviteRepository.findAll() }
    }


    @Test
    fun `test getBetterThanPercentage() that percentage is returned when validPercentages is not an empty list`() {
        val validPercentages = listOf(30f, 50f, 70f)
        val invitePercentage = 60f

        val getBetterThanPercentage = resultReadService.javaClass.getDeclaredMethod("getBetterThanPercentage", List::class.java, Float::class.java)
        getBetterThanPercentage.isAccessible = true

        val result = getBetterThanPercentage.invoke(resultReadService, validPercentages, invitePercentage) as Float

        assertThat(result).isEqualTo((2f / 3f) * 100) // 2 values (30, 50) are lower than 60
    }

    @Test
    fun `test getBetterThanPercentage() that 0 is returned when validPercentages is an empty list`() {
        val validPercentages = emptyList<Float>()
        val invitePercentage = 60f

        val getBetterThanPercentage = resultReadService.javaClass.getDeclaredMethod("getBetterThanPercentage", List::class.java, Float::class.java)
        getBetterThanPercentage.isAccessible = true

        val result = getBetterThanPercentage.invoke(resultReadService, validPercentages, invitePercentage) as Float

        assertThat(result).isEqualTo(0f)
    }


    @Test
    fun `test getDistributionGroups() that a list of 10 items is returned`() {
        val validPercentages = listOf(10f, 20f, 30f, 40f, 50f, 60f, 70f, 80f, 90f, 100f)

        val getDistributionGroups = resultReadService.javaClass.getDeclaredMethod("getDistributionGroups", List::class.java)
        getDistributionGroups.isAccessible = true

        val result = getDistributionGroups.invoke(resultReadService, validPercentages) as MutableList<Int>

        assertThat(result).hasSize(10)
    }

    @Test
    fun `test getDistributionGroups() that the items in the validPercentages list are all returned when between 0 and 100`() {
        val validPercentages = listOf(5f, 15f, 25f, 35f, 45f, 55f, 65f, 75f, 85f, 95f)

        val getDistributionGroups = resultReadService.javaClass.getDeclaredMethod("getDistributionGroups", List::class.java)
        getDistributionGroups.isAccessible = true

        val result = getDistributionGroups.invoke(resultReadService, validPercentages) as MutableList<Int>

        assertThat(result.sum()).isEqualTo(validPercentages.size)
    }


    @Test
    fun `test getSelectedDistributionGroup() that index of distribution groups is returned when percentages are between 0 and 100`() {
        val percentage = 73f

        val getSelectedDistributionGroup = resultReadService.javaClass.getDeclaredMethod("getSelectedDistributionGroup", Float::class.java)
        getSelectedDistributionGroup.isAccessible = true

        val result = getSelectedDistributionGroup.invoke(resultReadService, percentage) as Int

        assertThat(result).isEqualTo(6) // 73 / 10 -1 = 6
    }

    @Test
    fun `test getSelectedDistributionGroup() that -1 is returned when percentages are not between 0 and 100`() {
        val percentage1 = -5f
        val percentage2 = 150f

        val getSelectedDistributionGroup = resultReadService.javaClass.getDeclaredMethod("getSelectedDistributionGroup", Float::class.java)
        getSelectedDistributionGroup.isAccessible = true

        val result1 = getSelectedDistributionGroup.invoke(resultReadService, percentage1) as Int
        val result2 = getSelectedDistributionGroup.invoke(resultReadService, percentage2) as Int

        assertThat(result1).isEqualTo(-1)
        assertThat(result2).isEqualTo(-1)
    }


    @Test
    fun `test getValidPercentages() that only invites with not null scoredPoints are used`() {
        val invite1 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.app_finished
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 1L
                    ),
                    this, Assignment(1L, "Test")
                ).apply { scoredPoints = 80 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100)))))
        }
        val invite2 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.app_finished
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentMultipleChoice(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 2L
                    ),
                    this, Assignment(2L, "Test")
                )
            )
            assessment =
                Assessment(2L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100)))))
        }

        val getValidPercentages = resultReadService.javaClass.getDeclaredMethod("getValidPercentages", List::class.java)
        getValidPercentages.isAccessible = true

        val result = getValidPercentages.invoke(resultReadService, listOf(invite1, invite2)) as List<Float>

        assertThat(result).hasSize(1) // Only invite1 should be included
    }

    @Test
    fun `test getValidPercentages() that only invites with app_finished status are used`() {
        val invite1 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.app_finished
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 1L
                    ),
                    this, Assignment(1L, "Test")
                ).apply { scoredPoints = 80 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100)))))
        }
        val invite2 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.not_started
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentMultipleChoice(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 2L
                    ),
                    this, Assignment(2L, "Test")
                ).apply { scoredPoints = 90 }
            )
            assessment =
                Assessment(2L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100)))))
        }

        val getValidPercentages = resultReadService.javaClass.getDeclaredMethod("getValidPercentages", List::class.java)
        getValidPercentages.isAccessible = true

        val result = getValidPercentages.invoke(resultReadService, listOf(invite1, invite2)) as List<Float>

        assertThat(result).hasSize(1) // Only invite1 should be included
    }

    @Test
    fun `test getValidPercentages() that available points of larger than 0 are returned as percentage`() {
        val invite1 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.app_finished
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 1L
                    ),
                    this, Assignment(1L, "Test")
                ).apply { scoredPoints = 80 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 100), Assignment(availablePoints = 100)))))
        }

        val getValidPercentages = resultReadService.javaClass.getDeclaredMethod("getValidPercentages", List::class.java)
        getValidPercentages.isAccessible = true

        val result = getValidPercentages.invoke(resultReadService, listOf(invite1)) as List<Float>

        assertThat(result[0]).isEqualTo(40f)
    }

    @Test
    fun `test getValidPercentages() that available points of 0 are returned as null`() {
        val invite1 = Invite(
            UUID.randomUUID(),
            status = InviteStatus.app_finished
        ).apply {
            solutions = mutableListOf(
                SolvedAssignmentOpen(
                    SolvedAssignmentId(
                        UUID.randomUUID(), 1L
                    ),
                    this, Assignment(1L, "Test")
                ).apply { scoredPoints = 80 }
            )
            assessment =
                Assessment(1L, sections = mutableListOf(Section(assignments = mutableListOf(Assignment(availablePoints = 0), Assignment(availablePoints = 0)))))
        }

        val getValidPercentages = resultReadService.javaClass.getDeclaredMethod("getValidPercentages", List::class.java)
        getValidPercentages.isAccessible = true

        val result = getValidPercentages.invoke(resultReadService, listOf(invite1)) as List<Float>

        assertThat(result).isEmpty()
    }

}