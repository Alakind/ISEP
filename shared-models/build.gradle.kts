plugins {
    kotlin("jvm") version "1.9.23"
}

group = "ut.isep"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
}


tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}
