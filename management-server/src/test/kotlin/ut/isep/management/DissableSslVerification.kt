import java.security.cert.X509Certificate
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

fun disableSslVerification() {
    val trustAllCertificates = arrayOf<TrustManager>(
        object : X509TrustManager {
            override fun getAcceptedIssuers(): Array<X509Certificate>? = null
            override fun checkClientTrusted(certs: Array<X509Certificate>?, authType: String?) {}
            override fun checkServerTrusted(certs: Array<X509Certificate>?, authType: String?) {}
        }
    )

    val sslContext = SSLContext.getInstance("TLS")
    sslContext.init(null, trustAllCertificates, java.security.SecureRandom())
    HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.socketFactory)
    HttpsURLConnection.setDefaultHostnameVerifier { _, _ -> true }
}
