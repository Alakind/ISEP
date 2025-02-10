package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class UnauthorizedExceptionUnitTest {

    @Test
    fun `should throw UnauthorizedException with correct message`() {
        val exceptionMessage = "This action is unauthorized"
        val exception = assertThrows<UnauthorizedException> {
            throw UnauthorizedException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}