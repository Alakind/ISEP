package ut.isep.management

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(
    classes = [ManagementApplication::class],
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
abstract class ManagementApplicationIT : TestContainersIT() {

    @Test
    fun contextLoads() {
    }
}
