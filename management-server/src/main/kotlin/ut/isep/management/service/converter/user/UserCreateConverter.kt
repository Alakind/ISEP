package ut.isep.management.service.converter.user

import dto.user.UserCreateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.User
import ut.isep.management.service.converter.CreateConverter

@Component
class UserCreateConverter : CreateConverter<User, UserCreateDTO> {

    override fun fromDTO(createDTO: UserCreateDTO): User {
        return User(
            name = createDTO.name,
            oid = createDTO.oid,
            email = createDTO.email,
            role = createDTO.role
        )
    }
}

