package enumerable


enum class InviteStatus {
    not_started,
    app_reminded_once,
    app_reminded_twice,
    expired,
    app_started,
    app_finished,
    cancelled;

    companion object {
        fun fromString(value: String): InviteStatus {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("No enum constant for value: $value")
        }
    }
}


