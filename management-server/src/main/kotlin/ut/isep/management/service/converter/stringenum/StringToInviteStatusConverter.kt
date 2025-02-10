package ut.isep.management.service.converter.stringenum

import enumerable.InviteStatus
import org.springframework.core.convert.ConversionFailedException
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.Converter
import org.springframework.stereotype.Component

@Component
class StringToInviteStatusConverter : Converter<String, InviteStatus> {
    override fun convert(source: String): InviteStatus {
        return try {
            InviteStatus.fromString(source)
        } catch (ex: IllegalArgumentException) {
            throw ConversionFailedException(TypeDescriptor.valueOf(String.Companion::class.java), TypeDescriptor.valueOf(InviteStatus::class.java), source, ex)
        }
    }
}