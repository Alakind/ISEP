package ut.isep.management.config

import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import ut.isep.management.service.converter.stringenum.StringToAllowedInvitesDateAttributeNamesConverter
import ut.isep.management.service.converter.stringenum.StringToInviteStatusConverter

@SpringBootTest
@EnableWebMvc
@ActiveProfiles("test")
class WebConfigUnitTest {

    @Autowired
    private lateinit var webApplicationContext: WebApplicationContext

    private lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()
    }

    @Test
    fun `test CORS configuration allows all origins, methods, and headers`() {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/user"))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect { mvcResult ->
                mvcResult.response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN) == "*"
                mvcResult.response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS) == "*"
                mvcResult.response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS) == "*"
                mvcResult.response.getHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS) == "Location"
            }
    }

    @Test
    fun `test formatter and converters registration`() {
        val context = webApplicationContext
        val stringToInviteStatusConverter = context.getBean(StringToInviteStatusConverter::class.java)
        val stringToAllowedInvitesDateAttributeNamesConverter = context.getBean(StringToAllowedInvitesDateAttributeNamesConverter::class.java)

        assertNotNull(stringToInviteStatusConverter, "String to Invite status converter should not be null")
        assertNotNull(stringToAllowedInvitesDateAttributeNamesConverter, "String to Allowed invites date attribute names converter should not be null")
    }
}
