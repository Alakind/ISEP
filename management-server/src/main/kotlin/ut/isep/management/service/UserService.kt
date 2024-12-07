package ut.isep.management.service

import dto.*
import dto.user.UserCreateDTO
import dto.user.UserReadDTO
import dto.user.UserUpdateDTO
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ut.isep.management.model.entity.User
import ut.isep.management.repository.UserRepository
import kotlin.NoSuchElementException


@Service
@Transactional
class UserService(
    private val usersRepository: UserRepository,
) {

    fun createUser(userDTO: UserCreateDTO): User {
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

    fun getUserById(id: Long): UserReadDTO {
        val user: User = usersRepository.findById(id).orElseThrow{
            NoSuchElementException("User not found with id $id")
        }
        return user.toDTO()
    }

    fun getAllUsers(limit: Int?, page: Int?, sort: String?): PaginatedDTO<UserReadDTO> {
        val sortCriteria = parseSort(sort)
        val users = if (limit != null) {
            val pageable = PageRequest.of(page ?: 0, limit, sortCriteria)
            usersRepository.findAll(pageable).content.map(User::toDTO)
        } else {
            usersRepository.findAll(sortCriteria).map(User::toDTO)
        }
        val amount = usersRepository.count()
        return PaginatedDTO(amount, users)
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
