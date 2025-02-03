package ut.isep.management.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import dto.PaginatedDTO
import dto.user.UserCreateDTO
import dto.user.UserReadDTO
import dto.user.UserUpdateDTO
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Example
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ut.isep.management.model.entity.User
import ut.isep.management.service.user.UserCreateService
import ut.isep.management.service.user.UserReadService
import ut.isep.management.service.user.UserUpdateService

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserControllerUnitTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = ObjectMapper()

    @MockkBean
    lateinit var userReadService: UserReadService

    @MockkBean
    lateinit var userCreateService: UserCreateService

    @MockkBean
    private lateinit var userUpdateService: UserUpdateService

    private val user1 = User(id = 1L, name = "John Doe", email = "john@example.com", oid = "jdkc39e4-3453-345g-8360-dfg24d45dg56")
    private val user2 = User(id = 2L, name = "Jane Doe", email = "jane@example.com")

    private val user1ReadDTO = UserReadDTO(id = 1L, name = "John Doe", email = "john@example.com", oid = "jdkc39e4-3453-345g-8360-dfg24d45dg56", createdAt = user1.createdAt)
    private val user2ReadDTO = UserReadDTO(id = 1L, name = "Jane Doe", email = "jane@example.com", createdAt = user2.createdAt)

    @Test
    fun `test user 1 is returned`() {
        // given
        every { userReadService.getById(1) } returns user1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/user/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(user1.name))
    }

    @Test
    fun `test paginated users list is returned with null example`() {
        // given
        every { userReadService.getPaginated(any<User>(), any<Pageable>()) } returns PaginatedDTO(2, listOf(user1ReadDTO, user2ReadDTO))
        every { userReadService.getPaginated(any<Example<User>>(), any<Pageable>()) } returns PaginatedDTO(2, listOf(user1ReadDTO, user2ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/user")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(2))
            .andExpect(jsonPath("$.data.size()").value(2))
            .andExpect(jsonPath("$.data[0].name").value(user1.name))
            .andExpect(jsonPath("$.data[1].name").value(user2.name))
    }

    @Test
    fun `test paginated users list is returned with name example`() {
        // given
        every { userReadService.getPaginated(any<User>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))
        every { userReadService.getPaginated(any<Example<User>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .param("name", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(user1.name))
    }

    @Test
    fun `test paginated users list is returned with email example`() {
        // given
        every { userReadService.getPaginated(any<User>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))
        every { userReadService.getPaginated(any<Example<User>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .param("email", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(user1.name))
    }

    @Test
    fun `test paginated users list is returned with name and email example`() {
        // given
        every { userReadService.getPaginated(any<User>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))
        every { userReadService.getPaginated(any<Example<User>>(), any<Pageable>()) } returns PaginatedDTO(1, listOf(user1ReadDTO))

        // verify and assert
        mockMvc.perform(
            get("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .param("name", "John")
                .param("email", "John")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.data.size()").value(1))
            .andExpect(jsonPath("$.data[0].name").value(user1.name))
    }

    @Test
    fun `test user 1 is returned with the requested oid`() {
        // variable
        val oid = "jdkc39e4-3453-345g-8360-dfg24d45dg56"

        // given
        every { userReadService.getByOid(oid, any<User>()) } returns user1ReadDTO

        // verify and assert
        mockMvc.perform(
            get("/user/oid/$oid")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(user1.name))
            .andExpect(jsonPath("$.oid").value(user1.oid))
    }

    @Test
    fun `test 'Added an user' and location is returned when user 2 is created`() {
        // variables
        val user2CreateDTO = UserCreateDTO(name = "Jane Doe", email = "jane@example.com")

        // given
        every { userCreateService.create(user2CreateDTO) } returns user2

        // verify and assert
        mockMvc.perform(
            post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2CreateDTO))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Added an user"))
            .andExpect(header().string("Location", "http://localhost/user/${user2.id}"))
    }

    @Test
    fun `test 'Updated an user' is returned when user 1 is updated`() {
        // variables
        val user1UpdateDTO = UserUpdateDTO(id = 1L, name = null, email = "john.doe@example.com")
        val user1Updated = User(id = 1L, name = "John Doe", email = "john.doe@example.com", createdAt = user1.createdAt)

        // given
        every { userUpdateService.update(user1UpdateDTO) } returns user1Updated

        // verify and assert
        mockMvc.perform(
            put("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1UpdateDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("text/plain;charset=UTF-8"))
            .andExpect(jsonPath("$").value("Updated an user"))
    }

    @Test
    fun `test '204' is returned when user 1 is deleted`() {
        // given
        every { userReadService.delete(1) } returns Unit

        // verify and assert
        mockMvc.perform(
            delete("/user/1")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isNoContent)
    }
}