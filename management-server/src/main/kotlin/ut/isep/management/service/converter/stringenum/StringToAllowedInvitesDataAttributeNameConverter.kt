package ut.isep.management.service.converter.stringenum

import enumerable.AllowedInvitesDateAttributeNames
import org.springframework.core.convert.ConversionFailedException
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.Converter

class StringToAllowedInvitesDateAttributeNamesConverter : Converter<String, AllowedInvitesDateAttributeNames> {
    override fun convert(source: String): AllowedInvitesDateAttributeNames {
        return try {
            AllowedInvitesDateAttributeNames.fromString(source)
        } catch (ex: IllegalArgumentException) {
            throw ConversionFailedException(TypeDescriptor.valueOf(String.Companion::class.java), TypeDescriptor.valueOf(AllowedInvitesDateAttributeNames::class.java), source, ex)
        }

    }
}