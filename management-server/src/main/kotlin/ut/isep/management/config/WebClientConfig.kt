package ut.isep.management.config

import io.netty.handler.ssl.SslContextBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.ClientRequest
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFilterFunction
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.netty.http.client.HttpClient
import reactor.netty.resources.ConnectionProvider
import ut.isep.management.util.logger
import java.security.KeyStore
import javax.net.ssl.TrustManagerFactory


@Configuration
class WebClientConfig {
    val log = logger()

    private fun logRequest(): ExchangeFilterFunction {
        return ExchangeFilterFunction.ofRequestProcessor { clientRequest: ClientRequest ->
            log.info("Request: ${clientRequest.method()} ${clientRequest.url()}")
            clientRequest.headers().forEach { name, values ->
                values.forEach { value ->
                    log.info("$name=$value")
                }
            }
            Mono.just(clientRequest)
        }
    }

    private fun logResponse(): ExchangeFilterFunction {
        return ExchangeFilterFunction.ofResponseProcessor { clientResponse: ClientResponse ->
            log.info("Response: ${clientResponse.headers().asHttpHeaders()["property-header"]}")
            Mono.just(clientResponse)
        }
    }


    @Bean(name = ["githubWebClient"])
    fun githubWebClient(): WebClient {
        val connectionProviderName = "github-connection-provider"
        val maxConnections = 100 // GitHub REST API allows no more than 100 concurrent requests
        val pendingAcquireMaxCount = 1000
        val githubToken = System.getenv("GITHUB_TOKEN")
        val connectionProvider = ConnectionProvider.builder(connectionProviderName)
            .maxConnections(maxConnections)
            .pendingAcquireMaxCount(pendingAcquireMaxCount)
            .build()
        val httpClient = HttpClient.create(connectionProvider)
        val webClientBuilder =  WebClient.builder()
            .baseUrl("https://raw.githubusercontent.com/eefscheef/ISEP-questions-demo")
            .defaultHeader("Authorization", "Bearer $githubToken")
            .clientConnector(ReactorClientHttpConnector(httpClient))
            .filter(logRequest())
            .filter(logResponse())
        githubToken?.let {
            webClientBuilder.defaultHeader("Authorization", "Bearer $it")
        }
        return webClientBuilder.build()
    }


    @Bean(name = ["executorWebClient"])
    fun executorWebClient(): WebClient {
        val trustStorePath = "certificates/trust-executor.jks" // Self-signed cert for executor (applicant-server)
        val trustStorePassword = "changeit"
        val trustStore = KeyStore.getInstance(KeyStore.getDefaultType())
        val classLoader = Thread.currentThread().contextClassLoader
        classLoader.getResourceAsStream(trustStorePath)?.use { inputStream ->
            trustStore.load(inputStream, trustStorePassword.toCharArray())
        }

        // Use the keystore in SSLContext
        val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
        trustManagerFactory.init(trustStore)

        val sslContext = SslContextBuilder.forClient()
            .trustManager(trustManagerFactory)
            .build()

        // Configure HttpClient with SSL context
        val httpClient = HttpClient.create().secure { sslContextSpec ->
            sslContextSpec.sslContext(sslContext)
        }

        return WebClient.builder()
            .baseUrl("https://localhost:8080/code-executor")
            .clientConnector(ReactorClientHttpConnector(httpClient))
            .build()
    }


}
