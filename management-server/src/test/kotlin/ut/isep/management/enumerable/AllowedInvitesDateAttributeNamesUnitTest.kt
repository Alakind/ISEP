package ut.isep.management.enumerable

import enumerable.AllowedInvitesDateAttributeNames
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class AllowedInvitesDateAttributeNamesUnitTest {
    @Test
    fun `test fromString() returns correct enum for valid values`() {
        assertEquals(AllowedInvitesDateAttributeNames.expiresAt, AllowedInvitesDateAttributeNames.fromString("expiresAt"))
        assertEquals(AllowedInvitesDateAttributeNames.invitedAt, AllowedInvitesDateAttributeNames.fromString("invitedAt"))
        assertEquals(AllowedInvitesDateAttributeNames.assessmentStartedAt, AllowedInvitesDateAttributeNames.fromString("assessmentStartedAt"))
        assertEquals(AllowedInvitesDateAttributeNames.assessmentFinishedAt, AllowedInvitesDateAttributeNames.fromString("assessmentFinishedAt"))
    }

    @Test
    fun `test fromString() is case insensitive`() {
        assertEquals(AllowedInvitesDateAttributeNames.expiresAt, AllowedInvitesDateAttributeNames.fromString("EXPIRESAT"))
        assertEquals(AllowedInvitesDateAttributeNames.invitedAt, AllowedInvitesDateAttributeNames.fromString("invitedat"))
        assertEquals(AllowedInvitesDateAttributeNames.assessmentStartedAt, AllowedInvitesDateAttributeNames.fromString("ASSESSMENTSTARTEDAT"))
        assertEquals(AllowedInvitesDateAttributeNames.assessmentFinishedAt, AllowedInvitesDateAttributeNames.fromString("assessmentfinishedat"))
    }

    @Test
    fun `test fromString() throws IllegalArgumentException for invalid values`() {
        val exception = assertThrows<IllegalArgumentException> {
            AllowedInvitesDateAttributeNames.fromString("invalidValue")
        }
        assertThat(exception.message).isEqualTo("No enum constant for value: invalidValue")
    }
}