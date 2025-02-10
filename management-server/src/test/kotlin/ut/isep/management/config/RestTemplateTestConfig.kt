package ut.isep.management.config

import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory
import org.apache.hc.core5.ssl.SSLContexts
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.DefaultUriBuilderFactory
import java.security.KeyStore

@Configuration
class RestTemplateTestConfig {
    @Value("\${management.base-url}")
    lateinit var managementURL: String

    @Bean(name = ["executorTestRestTemplate"])
    fun executorRestTemplate(): RestTemplate {
        // Path to the self-signed certificate
        val trustStorePath = "certificates/trust-executor.jks"
        val classLoader = Thread.currentThread().contextClassLoader
        val trustStorePassword = "changeit"
        val trustStoreInputStream = classLoader.getResourceAsStream(trustStorePath)
        val trustStore = KeyStore.getInstance(KeyStore.getDefaultType())
        trustStore.load(trustStoreInputStream, trustStorePassword.toCharArray())
        trustStoreInputStream?.close()

        // Create an SSLContext that uses the KeyStore
        val sslContext = SSLContexts.custom()
            .loadTrustMaterial(trustStore, null)
            .build()

        val cm = PoolingHttpClientConnectionManagerBuilder.create()
            .setSSLSocketFactory(
                SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE)
            )
            .build()

        val httpClient = HttpClients.custom()
            .setConnectionManager(cm)
            .build()

        return RestTemplate(HttpComponentsClientHttpRequestFactory(httpClient)).apply {
            uriTemplateHandler = DefaultUriBuilderFactory(managementURL)
        }
    }
}