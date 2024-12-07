package ut.isep.management.service

import dto.UserCreateDTO
import dto.UserReadDTO
import org.springframework.stereotype.Service
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import kotlin.NoSuchElementException


@Service
@Transactional
class UserService(
    private val usersRepository: UserRepository,
) {

    fun createUser(userDTO: UserCreateReadDTO): User {
        val userEntity = userDTO.fromDTO()
        checkUserInDB(userEntity)
        return usersRepository.save(userEntity)
    }

    private fun checkUserInDB(u: User) {
        usersRepository.findById(u.id).ifPresent {
            throw Exception("User already exists")
        }
    }

    fun updateUser(updateDTO: UserUpdateDTO) {
        val user: User = usersRepository.findById(updateDTO.id).orElseThrow{
            NoSuchElementException("User not found with id $updateDTO.id")
        }
        user.apply {
            updateDTO.email?.let { this.email = it }
            updateDTO.role?.let { this.role = it }
            updateDTO.name?.let { this.name = it }
        }
        usersRepository.save(user)
    }

    fun deleteUser(id: Long) {
        usersRepository.deleteById(id)
    }

    fun getUserById(id: Long): UserCreateReadDTO {
        val user: User = usersRepository.findById(id).orElseThrow{
            NoSuchElementException("User not found with id $id")
        }
        return user.toDTO()
    }

    fun getAllUsers(limit: Int?, page: Int?, sort: String?): UsersPaginatedDTO {
        val sortCriteria = parseSort(sort)
        val pageable: Pageable = if (limit != null) {
            PageRequest.of(page ?: 0, limit, sortCriteria)
        } else {
            Pageable.unpaged(sortCriteria)
        }
        val amount = usersRepository.count()
        val users = usersRepository.findAll(pageable).content.map(User::toDTO)
        return UsersPaginatedDTO(amount, users)
    }

    private fun parseSort(sort: String?): Sort {
        if (sort.isNullOrEmpty()) {
            return Sort.unsorted()
        }
        val orders = sort.split(",").map { field ->
            val entry = field.split(":")
            val attribute = entry[0]
            val direction = if (entry.size == 2) { Sort.Direction.fromString(entry[1]) } else {
                Sort.Direction.ASC
            }
            Sort.Order(direction, attribute)
        }
        return Sort.by(orders)
    }
}
