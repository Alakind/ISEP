package ut.isep.management.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import java.util.concurrent.Executor

@Configuration
class AsyncConfig {

    @Bean(name = ["taskExecutor"])
    fun taskExecutor(): Executor {
        val executor = ThreadPoolTaskExecutor()
        executor.setCorePoolSize(5)
        executor.setMaxPoolSize(10)
        executor.setQueueCapacity(100)
        executor.setThreadNamePrefix("Async-")
        executor.initialize()
        return executor
    }
}