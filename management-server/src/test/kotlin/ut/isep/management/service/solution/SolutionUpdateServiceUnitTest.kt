package ut.isep.management.service.solution

import dto.solution.AnswerCreateReadDTO
import dto.solution.SolutionsUpdateDTO
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import parser.question.MultipleChoiceQuestion
import ut.isep.management.model.entity.*
import ut.isep.management.repository.SolvedAssignmentRepository
import ut.isep.management.service.assignment.AssignmentFetchService
import java.lang.reflect.InvocationTargetException
import java.util.*

class SolutionUpdateServiceUnitTest {

    private val solvedAssignmentRepository: SolvedAssignmentRepository = mockk()
    private val assignmentFetchService: AssignmentFetchService = mockk()
    private val solutionUpdateService: SolutionUpdateService = SolutionUpdateService(solvedAssignmentRepository, assignmentFetchService)

    private val inviteId = UUID.randomUUID()
    private val assignmentId = 1L
    private val key = SolvedAssignmentId(inviteId, assignmentId)

    @Test
    fun `test updateSolutions() that NoSuchElementException is thrown when solution can't be found`() {
        val createDTO = SolutionsUpdateDTO()
        createDTO[assignmentId.toString()] = AnswerCreateReadDTO.Open("answer")

        every { solvedAssignmentRepository.findById(key) } returns Optional.empty()

        val exception = assertThrows<NoSuchElementException> {
            solutionUpdateService.updateSolutions(inviteId, createDTO)
        }

        assertThat(exception.message).contains("No existing solution for assignment ID: $assignmentId")
    }

    @Test
    fun `test updateSolutions() that UnsupportedOperationException is thrown when the invite id of the solution is not the same as the provided invite id`() {
        val createDTO = SolutionsUpdateDTO()
        createDTO[assignmentId.toString()] = AnswerCreateReadDTO.Open("answer")
        val existingSolution = mockk<SolvedAssignment> {
            every { invite?.id } returns UUID.randomUUID()
        }

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(existingSolution)

        val exception = assertThrows<UnsupportedOperationException> {
            solutionUpdateService.updateSolutions(inviteId, createDTO)
        }

        assertThat(exception.message).contains("Cannot update solvedAssignments that don't belong to your invite")
    }

    @Test
    fun `test updateSolutions() that UnsupportedOperationException is thrown when the invite id is null`() {
        val createDTO = SolutionsUpdateDTO()
        createDTO[assignmentId.toString()] = AnswerCreateReadDTO.Open("answer")
        val existingSolution = mockk<SolvedAssignment> {
            every { invite?.id } returns null
        }

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(existingSolution)

        val exception = assertThrows<UnsupportedOperationException> {
            solutionUpdateService.updateSolutions(inviteId, createDTO)
        }

        assertThat(exception.message).contains("Cannot update solvedAssignments that don't belong to your invite")
    }

    @Test
    fun `test updateSolutions() that UnsupportedOperationException is thrown when the invite is null`() {
        val createDTO = SolutionsUpdateDTO()
        createDTO[assignmentId.toString()] = AnswerCreateReadDTO.Open("answer")
        val existingSolution = mockk<SolvedAssignment> {
            every { invite } answers { null }
        }

        every { solvedAssignmentRepository.findById(key) } returns Optional.of(existingSolution)

        val exception = assertThrows<UnsupportedOperationException> {
            solutionUpdateService.updateSolutions(inviteId, createDTO)
        }

        assertThat(exception.message).contains("Cannot update solvedAssignments that don't belong to your invite")
    }

    @Test
    fun `test updateSolutions() that each provided solution is processed`() {
        //FIXME: fetchService.fetchAssignment() throws exceptions: parser.question.Question, java.lang.InstantiationError: parser.question.Question

        val createDTO = SolutionsUpdateDTO()
        createDTO["1"] = AnswerCreateReadDTO.Open("answer")
//        createDTO["2"] = AnswerCreateReadDTO.MultipleChoice(listOf("one", "two"))
        createDTO["3"] = AnswerCreateReadDTO.Coding("code", "test")

        val key1 = SolvedAssignmentId(inviteId, 1L)
//        val key2 = SolvedAssignmentId(inviteId, 2L)
        val key3 = SolvedAssignmentId(inviteId, 3L)

        val existingSolution1 = mockk<SolvedAssignmentOpen>(relaxed = true) {
            var solution = ""
            every { invite?.id } returns inviteId
            every { userSolution } answers { solution }
            every { userSolution = any() } answers { solution = it.invocation.args[0] as String }
        }
//        val existingSolution2 = mockk<SolvedAssignmentMultipleChoice> {
//            var solution: List<String> = emptyList()
//            every { invite?.id } returns inviteId
//            every { userOptionsMarkedCorrect } answers { solution }
//            every { userOptionsMarkedCorrect = any() } answers { solution = it.invocation.args[0] as List<String> }
//            every { assignment } answers { Assignment() }
//            every { invite } answers { Invite(id = inviteId, assessment = Assessment(gitCommitHash = "slfjsoljfmolsjfoisj")) }
//        }
        val existingSolution3 = mockk<SolvedAssignmentCoding> {
            var solutionCode = ""
            var solutionTest = ""
            every { invite?.id } returns inviteId
            every { userCode } answers { solutionCode }
            every { userCode = any() } answers { solutionCode = it.invocation.args[0] as String }
            every { testCode } answers { solutionTest }
            every { testCode = any() } answers { solutionTest = it.invocation.args[0] as String }
        }

        every { solvedAssignmentRepository.findById(key1) } returns Optional.of(existingSolution1)
        every { solvedAssignmentRepository.save(existingSolution1 as SolvedAssignment) } returns existingSolution1
//        every { solvedAssignmentRepository.findById(key2) } returns Optional.of(existingSolution2)
//        every { solvedAssignmentRepository.save(existingSolution2 as SolvedAssignment) } returns existingSolution2
//        every { assignmentFetchService.fetchAssignment(existingSolution2.assignment!!, existingSolution2.invite!!.assessment!!.gitCommitHash!!) }
        every { solvedAssignmentRepository.findById(key3) } returns Optional.of(existingSolution3)
        every { solvedAssignmentRepository.save(existingSolution3 as SolvedAssignment) } returns existingSolution3

        solutionUpdateService.updateSolutions(inviteId, createDTO)

        verify(exactly = 1) { solvedAssignmentRepository.findById(key1) }
        verify(exactly = 1) { solvedAssignmentRepository.save(existingSolution1) }
//        verify(exactly = 1) { solvedAssignmentRepository.findById(key2) }
//        verify(exactly = 1) { solvedAssignmentRepository.save(existingSolution2) }
        verify(exactly = 1) { solvedAssignmentRepository.findById(key3) }
        verify(exactly = 1) { solvedAssignmentRepository.save(existingSolution3) }
    }


    @Test
    @Disabled
    fun `test updateSolution() that SolvedAssignmentMultipleChoice calls updateMCSolution() and saves the entity`() {
        //FIXME: fetchService.fetchAssignment() throws exceptions: parser.question.Question, java.lang.InstantiationError: parser.question.Question
        val solution = mockk<SolvedAssignmentMultipleChoice>(relaxed = true)
        val answerDTO = mockk<AnswerCreateReadDTO.MultipleChoice>()

        val updateSolution = solutionUpdateService.javaClass.getDeclaredMethod("updateSolution", SolvedAssignment::class.java, AnswerCreateReadDTO::class.java)
        updateSolution.isAccessible = true

        every { updateSolution.invoke(solutionUpdateService, solution, answerDTO) } answers { callOriginal() }
        updateSolution.invoke(solutionUpdateService, solution, answerDTO)

        val updateMCSolution = solutionUpdateService.javaClass.getDeclaredMethod("updateMCSolution", SolvedAssignmentMultipleChoice::class.java, AnswerCreateReadDTO.MultipleChoice::class.java)
        updateMCSolution.isAccessible = true

        verify { updateMCSolution.invoke(solutionUpdateService, solution, answerDTO) }
    }

    @Test
    fun `test updateSolution() that SolvedAssignmentCoding calls updateCodingSolution() and saves the entity`() {
        val solution = mockk<SolvedAssignmentCoding>(relaxed = true) {
            var solutionCode = ""
            var solutionTest = ""
            every { invite?.id } returns inviteId
            every { userCode } answers { solutionCode }
            every { userCode = any() } answers { solutionCode = it.invocation.args[0] as String }
            every { testCode } answers { solutionTest }
            every { testCode = any() } answers { solutionTest = it.invocation.args[0] as String }
        }
        val answerDTO = AnswerCreateReadDTO.Coding(code = "print('Hello')", test = "assert True")

        every { solvedAssignmentRepository.save(any()) } answers { firstArg() }

        val updateSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateSolution", SolvedAssignment::class.java, AnswerCreateReadDTO::class.java
        )
        updateSolution.isAccessible = true
        updateSolution.invoke(solutionUpdateService, solution, answerDTO)

        val updateCodingSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateCodingSolution", SolvedAssignmentCoding::class.java, AnswerCreateReadDTO.Coding::class.java
        )
        updateCodingSolution.isAccessible = true
        updateCodingSolution.invoke(solutionUpdateService, solution, answerDTO)

        verify { solvedAssignmentRepository.save(solution) }
        assertThat(solution.userCode).isEqualTo(answerDTO.code)
        assertThat(solution.testCode).isEqualTo(answerDTO.test)
    }

    @Test
    fun `test updateSolution() that SolvedAssignmentOpen calls updateOpenSolution() and saves the entity`() {
        val solution = mockk<SolvedAssignmentOpen>(relaxed = true) {
            var solution = ""
            every { invite?.id } returns inviteId
            every { userSolution } answers { solution }
            every { userSolution = any() } answers { solution = it.invocation.args[0] as String }
        }
        val answerDTO = AnswerCreateReadDTO.Open(answer = "answer")

        every { solvedAssignmentRepository.save(any()) } answers { firstArg() }

        val updateSolution = solutionUpdateService.javaClass.getDeclaredMethod("updateSolution", SolvedAssignment::class.java, AnswerCreateReadDTO::class.java)
        updateSolution.isAccessible = true
        updateSolution.invoke(solutionUpdateService, solution, answerDTO)

        val updateOpenSolution = solutionUpdateService.javaClass.getDeclaredMethod("updateOpenSolution", SolvedAssignmentOpen::class.java, AnswerCreateReadDTO.Open::class.java)
        updateOpenSolution.isAccessible = true
        updateOpenSolution.invoke(solutionUpdateService, solution, answerDTO)

        verify { solvedAssignmentRepository.save(solution) }
        assertThat(solution.userSolution).isEqualTo(answerDTO.answer)
    }

    @Test
    fun `test updateSolution() that UnsupportedOperationException is thrown when solved assignment type is unknown`() {
        val solution = mockk<SolvedAssignmentTest>(relaxed = true) {
            var solution = ""
            every { invite?.id } returns inviteId
            every { test } answers { solution }
            every { test = any() } answers { solution = it.invocation.args[0] as String }
        }
        val answerDTO = mockk<AnswerCreateReadDTO.Open>() // this can stay a valid object for the test

        val updateSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateSolution", SolvedAssignment::class.java, AnswerCreateReadDTO::class.java
        )
        updateSolution.isAccessible = true

        val exception = assertThrows<UnsupportedOperationException> {
            try {
                updateSolution.invoke(solutionUpdateService, solution, answerDTO)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("Unsupported assignment type")
    }


    @Test
    @Disabled
    fun `test updateMCSolution() that IllegalArgumentException is thrown when the fetched question has multiple answers for a single-answer MC question`() {
        //TODO: this needs to be fixed first : fetchService.fetchAssignment() throws exceptions: parser.question.Question, java.lang.InstantiationError: parser.question.Question
        val solution = mockk<SolvedAssignmentMultipleChoice>(relaxed = true) {
            every { assignment?.id } returns assignmentId
            every { invite?.assessment?.gitCommitHash } returns "hash123"
        }

        val question = mockk<MultipleChoiceQuestion> {
            every { options } returns listOf(
                mockk { every { text } returns "A"; every { isCorrect } returns true }
            )
        }

        every { assignmentFetchService.fetchAssignment(any(), any()) } returns question

        val answerDTO = AnswerCreateReadDTO.MultipleChoice(answer = listOf("A"))

        val updateMCSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateMCSolution", SolvedAssignmentMultipleChoice::class.java, AnswerCreateReadDTO.MultipleChoice::class.java
        )
        updateMCSolution.isAccessible = true

        val exception = assertThrows<UnsupportedOperationException> {
            try {
                updateMCSolution.invoke(solutionUpdateService, solution, answerDTO)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("Cannot store multiple answers for single-answer multiple-choice question ${solution.assignment!!.id}")
    }

    @Test
    @Disabled
    fun `test updateMCSolution() that IllegalArgumentException is thrown when an answer is provided which isn't one of the options`() {
        //TODO: this needs to be fixed first : fetchService.fetchAssignment() throws exceptions: parser.question.Question, java.lang.InstantiationError: parser.question.Question
        val solution = mockk<SolvedAssignmentMultipleChoice>(relaxed = true) {
            every { assignment?.id } returns assignmentId
            every { invite?.assessment?.gitCommitHash } returns "hash123"
        }

        val question = mockk<MultipleChoiceQuestion> {
            every { options } returns listOf(
                mockk { every { text } returns "A"; every { isCorrect } returns true }
            )
        }

        every { assignmentFetchService.fetchAssignment(any(), any()) } returns question

        val answerDTO = AnswerCreateReadDTO.MultipleChoice(answer = listOf("A"))

        val updateMCSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateMCSolution", SolvedAssignmentMultipleChoice::class.java, AnswerCreateReadDTO.MultipleChoice::class.java
        )
        updateMCSolution.isAccessible = true

        val exception = assertThrows<UnsupportedOperationException> {
            try {
                updateMCSolution.invoke(solutionUpdateService, solution, answerDTO)
            } catch (e: InvocationTargetException) {
                throw e.cause ?: e
            }
        }

        assertThat(exception.message).contains("Provided an answer which is not possible")
    }

    @Test
    @Disabled
    fun `test updateMCSolution() that solution is saved`() {
        //TODO: this needs to be fixed first : fetchService.fetchAssignment() throws exceptions: parser.question.Question, java.lang.InstantiationError: parser.question.Question
        val solution = mockk<SolvedAssignmentMultipleChoice>(relaxed = true) {
            every { assignment?.id } returns assignmentId
            every { invite?.assessment?.gitCommitHash } returns "hash123"
        }

        val question = mockk<MultipleChoiceQuestion> {
            every { options } returns listOf(
                mockk { every { text } returns "A"; every { isCorrect } returns true }
            )
        }

        every { assignmentFetchService.fetchAssignment(any(), any()) } returns question
        every { solvedAssignmentRepository.save(solution) } returns solution

        val answerDTO = AnswerCreateReadDTO.MultipleChoice(answer = listOf("A"))

        val updateMCSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateMCSolution", SolvedAssignmentMultipleChoice::class.java, AnswerCreateReadDTO.MultipleChoice::class.java
        )
        updateMCSolution.isAccessible = true
        updateMCSolution.invoke(solutionUpdateService, solution, answerDTO)

        verify { solvedAssignmentRepository.save(solution) }
        assertThat(solution.userOptionsMarkedCorrect).isEqualTo(answerDTO.answer)
    }


    @Test
    fun `test updateCodingSolution() that user code and test code are saved`() {
        val solution = mockk<SolvedAssignmentCoding>(relaxed = true) {
            var solutionCode = ""
            var solutionTest = ""
            every { invite?.id } returns inviteId
            every { userCode } answers { solutionCode }
            every { userCode = any() } answers { solutionCode = it.invocation.args[0] as String }
            every { testCode } answers { solutionTest }
            every { testCode = any() } answers { solutionTest = it.invocation.args[0] as String }
        }
        val answerDTO = AnswerCreateReadDTO.Coding(code = "print('Hello')", test = "assert True")

        every { solvedAssignmentRepository.save(any()) } answers { firstArg() }

        val updateCodingSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateCodingSolution", SolvedAssignmentCoding::class.java, AnswerCreateReadDTO.Coding::class.java
        )
        updateCodingSolution.isAccessible = true
        updateCodingSolution.invoke(solutionUpdateService, solution, answerDTO)

        verify { solvedAssignmentRepository.save(solution) }
        assertThat(solution.userCode).isEqualTo(answerDTO.code)
        assertThat(solution.testCode).isEqualTo(answerDTO.test)
    }


    @Test
    fun `test updateOpenSolution() that user text is saved`() {
        val solution = mockk<SolvedAssignmentOpen>(relaxed = true) {
            var solution = ""
            every { invite?.id } returns inviteId
            every { userSolution } answers { solution }
            every { userSolution = any() } answers { solution = it.invocation.args[0] as String }
        }
        val answerDTO = AnswerCreateReadDTO.Open(answer = "answer")

        every { solvedAssignmentRepository.save(any()) } answers { firstArg() }

        val updateOpenSolution = solutionUpdateService.javaClass.getDeclaredMethod(
            "updateOpenSolution", SolvedAssignmentOpen::class.java, AnswerCreateReadDTO.Open::class.java
        )
        updateOpenSolution.isAccessible = true
        updateOpenSolution.invoke(solutionUpdateService, solution, answerDTO)

        verify { solvedAssignmentRepository.save(solution) }
        assertThat(solution.userSolution).isEqualTo(answerDTO.answer)
    }

}