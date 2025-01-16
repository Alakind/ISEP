package enumerable

enum class AllowedInvitesDateAttributeNames {
    expiresAt,
    invitedAt,
    assessmentStartedAt,
    assessmentFinishedAt;

    companion object {
        fun fromString(value: String): AllowedInvitesDateAttributeNames {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("No enum constant for value: $value")
        }
    }
}