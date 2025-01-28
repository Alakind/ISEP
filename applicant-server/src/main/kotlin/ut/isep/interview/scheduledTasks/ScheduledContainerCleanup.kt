package ut.isep.interview.scheduledTasks

import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import ut.isep.interview.code_execution.utils.ContainerAPI
import java.time.Instant

@Component
class ScheduledContainerCleanup {

    @Scheduled(fixedRate = 24*60*60*1000L)
    fun reportCurrentTime() {
        val logger = LoggerFactory.getLogger(this::class.java)
        val amount = ContainerAPI.stopContainerOlderThan(Instant.now().minusSeconds(24*60*60*1000L))
        if (amount > 0) logger.info("Stopped $amount containers which where running for longer than 24 hours")
    }
}