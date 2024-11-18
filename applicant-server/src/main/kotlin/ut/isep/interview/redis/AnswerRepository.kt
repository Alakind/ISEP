package ut.isep.interview.redis

import org.springframework.data.keyvalue.repository.KeyValueRepository
import org.springframework.stereotype.Repository
import ut.isep.interview.model.AnswerInterview


@Repository
interface AnswerRepository : KeyValueRepository<AnswerInterview, Long>
