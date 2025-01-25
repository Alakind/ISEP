package ut.isep.management.repository

import ut.isep.management.model.entity.Assessment

interface AssessmentRepository : BaseRepository<Assessment, Long> {

    fun findByTagAndLatestTrue(tag: String): Assessment?
}
