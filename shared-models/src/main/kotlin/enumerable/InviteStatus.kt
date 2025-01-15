package enumerable


enum class InviteStatus {
    app_finished,
    app_started,
    app_reminded_once,
    app_reminded_twice,
    cancelled,
    expired,
    not_started;

    companion object {
        fun isValidEnumLiteral(input: String): Boolean {
            return entries.any { it.name.equals(input, ignoreCase = true) }
        }
    }
}


