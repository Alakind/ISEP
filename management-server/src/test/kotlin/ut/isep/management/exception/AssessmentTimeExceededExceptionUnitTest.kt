package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class AssessmentTimeExceededExceptionTest {

    @Test
    fun `should throw AssessmentTimeExceededException with correct message`() {
        val exceptionMessage = "Assessment time exceeded"
        val exception = assertThrows<AssessmentTimeExceededException> {
            throw AssessmentTimeExceededException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}
