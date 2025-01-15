package enumerable

enum class AllowedInvitesDateAttributeNames {
    expiresAt,
    invitedAt,
    assessmentStartedAt,
    assessmentFinishedAt;

    companion object {
        fun isValidEnumLiteral(input: String): Boolean {
            return entries.any { it.name.equals(input, ignoreCase = true) }
        }
    }
}