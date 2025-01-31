package ut.isep.management.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.data.repository.query.QueryByExampleExecutor

@NoRepositoryBean
interface BaseRepository<E, ID> : JpaRepository<E, ID>, JpaSpecificationExecutor<E>, QueryByExampleExecutor<E>