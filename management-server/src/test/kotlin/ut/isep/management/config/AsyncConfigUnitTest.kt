package ut.isep.management.config

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import org.springframework.test.context.ActiveProfiles
import java.util.concurrent.Executor

@SpringBootTest
@ActiveProfiles("test")
class AsyncConfigUnitTest {

    @Autowired
    @Qualifier("taskExecutor")
    lateinit var executor: Executor

    @Test
    fun testTaskExecutorBeanCreation() {
        assertThat(executor).isInstanceOf(ThreadPoolTaskExecutor::class.java)

        val threadPoolExecutor = executor as ThreadPoolTaskExecutor
        assertThat(threadPoolExecutor.corePoolSize).isEqualTo(5)
        assertThat(threadPoolExecutor.maxPoolSize).isEqualTo(10)
        assertThat(threadPoolExecutor.queueCapacity).isEqualTo(100)
        assertThat(threadPoolExecutor.threadNamePrefix).isEqualTo("Async-")
    }
}