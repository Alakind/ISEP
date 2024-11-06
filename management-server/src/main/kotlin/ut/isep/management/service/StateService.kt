package ut.isep.management.service

import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import ut.isep.management.model.redis.State
import ut.isep.management.repository.redis.StateRepository
import java.util.*


@Service
@Transactional
class StateService(
    private val stateRepository: StateRepository
) {

    fun addState(state: State) {
        checkStateInDB(state)
        stateRepository.save(state)
    }

    private fun checkStateInDB(state: State) {
        val foundState: Optional<State> = stateRepository.findById(state.id)
        if (foundState.isPresent) {
            throw Exception("Applicant Already exists")
        }
    }

    fun getStateById(id: Long): State {
        val state: Optional<State> = stateRepository.findById(id)
        return state.orElseThrow {
            NoSuchElementException("Applicant not found with id $id")
        }
    }

    val allState: List<State>
        get() = stateRepository.findAll()
}
