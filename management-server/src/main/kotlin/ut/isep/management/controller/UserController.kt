package ut.isep.management.controller

import dto.PaginatedDTO
import dto.user.UserCreateDTO
import dto.user.UserReadDTO
import dto.user.UserUpdateDTO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ut.isep.management.model.entity.User
import ut.isep.management.service.user.UserCreateService
import ut.isep.management.service.user.UserReadService
import ut.isep.management.service.user.UserUpdateService
import java.net.URI

@RestController
@RequestMapping("/user")
@Tag(name = "User")
class UserController(
    val userReadService: UserReadService,
    val userCreateService: UserCreateService,
    val userUpdateService: UserUpdateService
) {


    @GetMapping
    @Operation(
        summary = "Get all users",
        description = "Returns a list of all users with the given search terms(s) and pagination parameters"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Returns a list of all users",
            ),
            ApiResponse(
                responseCode = "400",
                description = "Returns when sorting attribute name or ASC/DESC are incorrectly spelled",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getUsers(
        @ParameterObject
        @PageableDefault(
            size = Int.MAX_VALUE, sort = ["name"],
            direction = Sort.Direction.ASC
        ) pageable: Pageable,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) email: String?
    ): PaginatedDTO<UserReadDTO> {
        val exampleUser = if (name != null || email != null) {
            User(name = name, email = email)
        } else {
            null
        }
        return userReadService.getPaginatedEntity(exampleUser, pageable)
    }


    @GetMapping("{id}")
    @Operation(
        summary = "Get user",
        description = "Returns an user or 404 if not found"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the user",
            ),
            ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getUser(@PathVariable id: Long): ResponseEntity<UserReadDTO> {
        return ResponseEntity.ok(userReadService.getById(id))
    }


    @GetMapping("/oid/{oid}")
    @Operation(
        summary = "Get user based on oid",
        description = "Returns an user or 404 if not found"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Found the user",
            ),
            ApiResponse(
                responseCode = "404",
                description = "User not found with given oid",
                content = [Content(
                    schema = Schema(implementation = String::class)
                )]
            )
        ]
    )
    fun getUserOid(@PathVariable oid: String): ResponseEntity<UserReadDTO> {
        return ResponseEntity.ok(userReadService.getByOid(oid, User(oid = oid)))
    }

    @PostMapping
    @Operation(
        summary = "Add an user",
        description = "Add an user to the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Added the user",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Failed to add a user",
            )
        ]
    )
    fun postUser(@RequestBody user: UserCreateDTO): ResponseEntity<String> {
        val createdUser = userCreateService.create(user)
        val location: URI = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdUser.id)
            .toUri()

        return ResponseEntity.created(location).body("Added an user")
    }


    @PutMapping
    @Operation(
        summary = "Update an user",
        description = "Update an user in the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Updated the user",
            ),
            ApiResponse(
                responseCode = "404",
                description = "User not found",
            ),
            ApiResponse(
                responseCode = "500",
                description = "Failed to update an user",
            )
        ]
    )
    fun putUser(@RequestBody userDTO: UserUpdateDTO): ResponseEntity<String> {
        userUpdateService.update(userDTO)
        return ResponseEntity.ok("Updated an user")
    }

    @DeleteMapping("{id}")
    @Operation(
        summary = "Delete an user",
        description = "Delete an user from the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "204",
                description = "Deleted the user",
            ),
            ApiResponse(
                responseCode = "404",
                description = "User not found",
            )
        ]
    )
    fun deleteUser(@PathVariable id: Long): ResponseEntity<String> {
        return try {
            userReadService.delete(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

}
