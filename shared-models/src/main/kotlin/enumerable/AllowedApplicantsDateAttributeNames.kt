package enumerable

enum class AllowedApplicantsDateAttributeNames {
    createdAt;

    companion object {
        fun isValidEnumLiteral(input: String): Boolean {
            return entries.any { it.name.equals(input, ignoreCase = true) }
        }
    }
}
