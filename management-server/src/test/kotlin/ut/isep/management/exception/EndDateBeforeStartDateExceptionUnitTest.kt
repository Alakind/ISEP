package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class EndDateBeforeStartDateExceptionUnitTest {

    @Test
    fun `should throw EndDateBeforeStartDateException with correct message`() {
        val exceptionMessage = "End date is before start date"
        val exception = assertThrows<EndDateBeforeStartDateException> {
            throw EndDateBeforeStartDateException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}