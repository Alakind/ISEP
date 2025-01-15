package enumerable

enum class AllowedUsersDateAttributeNames {
    createdAt;

    companion object {
        fun isValidEnumLiteral(input: String): Boolean {
            return entries.any { it.name == input }
        }
    }
}