package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class TooManyRegisteredTimedObjectsExceptionUnitTest {

    @Test
    fun `should throw TooManyRegisteredTimedObjectsException with correct message`() {
        val exceptionMessage = "Too timed objects are registered"
        val exception = assertThrows<TooManyRegisteredTimedObjectsException> {
            throw TooManyRegisteredTimedObjectsException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}