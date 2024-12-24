package ut.isep.management.service.user


import dto.user.UserReadDTO
import org.springframework.data.domain.ExampleMatcher
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import ut.isep.management.service.ReadService
import ut.isep.management.service.converter.user.UserReadConverter

@Service
class UserReadService(
    repository: UserRepository,
    converter: UserReadConverter,
) : ReadService<User, UserReadDTO, Long>(repository, converter) {
    override val matcher = ExampleMatcher.matching()
        .withIgnoreNullValues()
        .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
        .withMatcher("email", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
        .withIgnorePaths("id", "role")
}

