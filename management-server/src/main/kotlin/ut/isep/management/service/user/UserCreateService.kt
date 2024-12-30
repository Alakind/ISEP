package ut.isep.management.service.user

import dto.user.UserCreateDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import ut.isep.management.service.CreateService
import ut.isep.management.service.converter.user.UserCreateConverter

@Service
class UserCreateService(
    repository: UserRepository,
    converter: UserCreateConverter,
) : CreateService<User, UserCreateDTO, Long>(repository, converter)

