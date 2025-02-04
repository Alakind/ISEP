package ut.isep.management.exception

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class OidNotUniqueExceptionUnitTest {

    @Test
    fun `should throw OidNotUniqueException with correct message`() {
        val exceptionMessage = "Oid is not unique"
        val exception = assertThrows<OidNotUniqueException> {
            throw OidNotUniqueException(exceptionMessage)
        }

        assertThat(exception.message).isEqualTo(exceptionMessage)
    }
}