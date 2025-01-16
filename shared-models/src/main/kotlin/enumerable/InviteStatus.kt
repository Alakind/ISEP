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
        fun fromString(value: String): InviteStatus {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("No enum constant for value: $value")
        }
    }
}


