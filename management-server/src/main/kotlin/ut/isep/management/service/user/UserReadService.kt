package ut.isep.management.service.user


import dto.user.UserReadDTO
import org.springframework.data.domain.Example
import org.springframework.data.domain.ExampleMatcher
import org.springframework.stereotype.Service
import ut.isep.management.exception.OidNotUniqueException
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.user.UserReadConverter

@Service
class UserReadService(
    repository: UserRepository,
    converter: UserReadConverter,
) : ReadService<User, UserReadDTO, Long>(repository, converter) {
    override val matcher: ExampleMatcher = ExampleMatcher.matching()
        .withIgnoreNullValues()
        .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
        .withMatcher("email", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
        .withIgnorePaths("id", "role", "createdAt", "oid")

    fun getByOid(oid: String, example: User): UserReadDTO {
        val matcher: ExampleMatcher = ExampleMatcher.matching()
            .withIgnoreNullValues()
            .withMatcher("oid", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
            .withIgnorePaths("id", "name", "email", "role", "createdAt")
        val users = repository.findAll(Example.of(example, matcher)).map { converter.toDTO(it) }
        if (users.size > 1) {
            throw OidNotUniqueException("Provided oid ($oid) is not unique")
        } else if (users.isEmpty()) {
            throw NoSuchElementException("No user found with oid $oid")
        }
        return users[0]

    }
}
