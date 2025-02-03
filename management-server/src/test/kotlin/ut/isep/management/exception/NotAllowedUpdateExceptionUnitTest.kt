package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class NotAllowedUpdateExceptionUnitTest {

    @Test
    fun `should throw NotAllowedUpdateException with correct message`() {
        val exceptionMessage = "This update is not allowed"
        val exception = org.junit.jupiter.api.assertThrows<NotAllowedUpdateException> {
            throw NotAllowedUpdateException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}