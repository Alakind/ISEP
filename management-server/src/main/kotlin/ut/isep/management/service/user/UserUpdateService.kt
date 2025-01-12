package ut.isep.management.service.user

import dto.user.UserUpdateDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.User
import ut.isep.management.service.UpdateService
import ut.isep.management.service.converter.UpdateConverter

@Service
class UserUpdateService(
    repository: JpaRepository<User, Long>,
    converter: UpdateConverter<User, UserUpdateDTO>
) : UpdateService<User, UserUpdateDTO, Long>(repository, converter)