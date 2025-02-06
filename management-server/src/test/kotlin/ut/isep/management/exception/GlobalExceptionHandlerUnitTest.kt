package ut.isep.management.exception

import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.core.MethodParameter
import org.springframework.data.mapping.PropertyReferenceException
import org.springframework.data.util.TypeInformation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.mail.MailSendException
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

class GlobalExceptionHandlerUnitTest {
    private val globalExceptionHandler = GlobalExceptionHandler()

    @Test
    fun `test handleNoSuchElementException()`() {
        val message = "message"
        val exception = NoSuchElementException(message)
        val response = globalExceptionHandler.handleNoSuchElementException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleHttpClientErrorException()`() {
        val message = "message"
        val exception = HttpClientErrorException(HttpStatus.NOT_FOUND, message)
        val response = globalExceptionHandler.handleHttpClientErrorException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        assertThat(response.body).isEqualTo("404 $message")
    }

    @Test
    fun `test handlePropertyReferenceException()`() {
        val propertyName = "invalidProperty"
        val type = TypeInformation.OBJECT
        val message = "No property '$propertyName' found for type 'Object'"

        val exception = PropertyReferenceException(propertyName, type, emptyList())

        val response = globalExceptionHandler.handlePropertyReferenceException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleEndDateBeforeStartDateException()`() {
        val message = "message"
        val exception = EndDateBeforeStartDateException(message)
        val response = globalExceptionHandler.handleEndDateBeforeStartDateException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleTooManyRegisteredTimedObjectsException()`() {
        val message = "message"
        val exception = TooManyRegisteredTimedObjectsException(message)
        val response = globalExceptionHandler.handleTooManyRegisteredTimedObjectsException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.CONFLICT)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleAssessmentTimeExceedException()`() {
        val message = "message"
        val exception = AssessmentTimeExceededException(message)
        val response = globalExceptionHandler.handleAssessmentTimeExceedException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleUnauthorizedException()`() {
        val message = "message"
        val exception = UnauthorizedException(message)
        val response = globalExceptionHandler.handleUnauthorizedException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleConversionConflict()`() {
        val value = "invalidValue"
        val requiredType = Int::class.java
        val name = "status"
        val methodParameter = mockk<MethodParameter>(relaxed = true)
        val cause = IllegalArgumentException("Invalid type")

        val exception = MethodArgumentTypeMismatchException(value, requiredType, name, methodParameter, cause)

        val response: ResponseEntity<String> = globalExceptionHandler.handleConversionConflict(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(exception.message)
    }

    @Test
    fun `test handleNotAllowedUpdateException()`() {
        val message = "message"
        val exception = NotAllowedUpdateException(message)
        val response = globalExceptionHandler.handleNotAllowedUpdateException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleIllegalArgumentException()`() {
        val message = "message"
        val exception = IllegalArgumentException(message)
        val response = globalExceptionHandler.handleIllegalArgumentException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleOidNotUniqueException()`() {
        val message = "message"
        val exception = OidNotUniqueException(message)
        val response = globalExceptionHandler.handleOidNotUniqueException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleMailSendException()`() {
        val message = "message"
        val exception = MailSendException(message)
        val response = globalExceptionHandler.handleMailSendException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleIllegalStateException()`() {
        val message = "message"
        val exception = IllegalStateException(message)
        val response = globalExceptionHandler.handleIllegalStateException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleUnsupportedOperationException()`() {
        val message = "message"
        val exception = UnsupportedOperationException(message)
        val response = globalExceptionHandler.handleUnsupportedOperationException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.FORBIDDEN)
        assertThat(response.body).isEqualTo(message)
    }

    @Test
    fun `test handleNoSuchFieldException()`() {
        val message = "message"
        val exception = NoSuchFieldException(message)
        val response = globalExceptionHandler.handleNoSuchFieldException(exception)

        assertThat(response.statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        assertThat(response.body).isEqualTo(message)
    }
}