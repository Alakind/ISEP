package ut.isep.management.config

import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder
import org.apache.hc.client5.http.ssl.*
import org.apache.hc.core5.ssl.SSLContexts
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestTemplate
import java.security.KeyStore
import java.security.cert.CertificateFactory

@Configuration
class RestTemplateConfig {

    @Bean(name = ["githubRestTemplate"])
    fun githubRestTemplate(): RestTemplate {
        val githubToken = System.getenv("GITHUB_TOKEN")
        val restTemplate = RestTemplate()
        val interceptor = ClientHttpRequestInterceptor { request, body, execution ->
            githubToken?.let {
                request.headers.add("Authorization", "Bearer $it")
            }
            execution.execute(request, body)
        }
        restTemplate.interceptors = listOf(interceptor)
        return restTemplate
    }

    @Bean(name = ["executorRestTemplate"])
    fun executorRestTemplate(): RestTemplate {
        // Path to the self-signed certificate
        val trustStorePath = "certificates/trust-executor.jks" // Update this path
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

        return RestTemplate(HttpComponentsClientHttpRequestFactory(httpClient))
    }

}
