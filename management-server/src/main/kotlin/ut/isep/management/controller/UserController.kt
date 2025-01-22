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
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
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
    @Operation(summary = "Get all users", description = "Returns a list of all users")
    @ApiResponse(
        responseCode = "200",
        description = "Returns a list of all users",
    )
    fun getUsers(
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
        return userReadService.getPaginated(exampleUser, pageable)
    }


    @GetMapping("{id}")
    @Operation(summary = "Get user", description = "Returns an user or 404 if not found")
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
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getUser(@PathVariable id: Long): ResponseEntity<UserReadDTO> {
        return try {
            ResponseEntity.ok(userReadService.getById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


    @GetMapping("/oid/{oid}")
    @Operation(summary = "Get user based on oid", description = "Returns an user or 404 if not found")
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
                    schema = Schema(implementation = DefaultErrorAttributes::class)
                )]
            )
        ]
    )
    fun getUserOid(@PathVariable oid: String): ResponseEntity<UserReadDTO> {
        return try {
            ResponseEntity.ok(userReadService.getByOid(oid, User(oid = oid)))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @PostMapping
    @Operation(
        summary = "Add an user",
        description = "Add an user to the PostGreSQL Management database"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Added the user",
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
            )
        ]
    )
    fun putUser(@RequestBody userDTO: UserUpdateDTO): ResponseEntity<String> {
        return try {
            userUpdateService.update(userDTO)
            ResponseEntity.ok("Updated an user")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
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
