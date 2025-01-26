package ut.isep.management.service.converter.user

import dto.user.UserUpdateDTO
import org.springframework.stereotype.Component
import ut.isep.management.model.entity.User
import ut.isep.management.service.converter.UpdateConverter

@Component
class UserUpdateConverter : UpdateConverter<User, UserUpdateDTO> {
    override fun updateEntity(entity: User, updateDTO: UserUpdateDTO): User {
        return entity.apply {
            updateDTO.email?.let { this.email = it }
            updateDTO.role?.let { this.role = it }
            updateDTO.name?.let { this.name = it }
            updateDTO.oid?.let { this.oid = it }
        }
    }
}
