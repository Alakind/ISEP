package enumerable

enum class AllowedApplicantsDateAttributeNames {
    createdAt;

    companion object {
        fun fromString(value: String): InviteStatus {
            return InviteStatus.entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("No enum constant for value: $value")
        }
    }
}
