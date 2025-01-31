package ut.isep.management.config

import org.springframework.context.annotation.Configuration
import org.springframework.format.FormatterRegistry
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import ut.isep.management.service.converter.stringenum.StringToAllowedInvitesDateAttributeNamesConverter
import ut.isep.management.service.converter.stringenum.StringToInviteStatusConverter


@Configuration
class WebConfig : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("*") // Allow all origins
            .allowedMethods("*") // Allow all HTTP methods
            .allowedHeaders("*") // Allow all headers
            .exposedHeaders("Location")
    }

    override fun addFormatters(registry: FormatterRegistry) {
        registry.addConverter(StringToInviteStatusConverter())
        registry.addConverter(StringToAllowedInvitesDateAttributeNamesConverter())
    }
}
