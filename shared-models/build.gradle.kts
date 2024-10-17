plugins {
    kotlin("jvm") version "1.9.23"
    `maven-publish`
}

group = "ut.isep"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.jetbrains.kotlin:kotlin-test")
}


tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}

//publishing {
//    publications {
//        register("mavenKotlin", MavenPublication::class) {
//            groupId = "ut.isep.interview"
//            artifactId = "shared-models"
//            from(components["kotlin"])
//        }
//    }
//}