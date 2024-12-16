package ut.isep.management.service.converter.user

import dto.user.UserReadDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.User
import ut.isep.management.service.converter.ReadConverter

@Component
class UserReadConverter : ReadConverter<User, UserReadDTO> {
    override fun toDTO(entity: User): UserReadDTO {
        return UserReadDTO(
            id = entity.id,
            name = entity.name!!,
            email = entity.email!!,
            role = entity.role
        )
    }
}
