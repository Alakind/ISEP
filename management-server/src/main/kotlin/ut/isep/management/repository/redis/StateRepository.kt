package ut.isep.management.repository.redis

import org.springframework.data.keyvalue.repository.KeyValueRepository
import org.springframework.stereotype.Repository
import ut.isep.management.model.redis.State


@Repository
interface StateRepository : KeyValueRepository<State, Long>
