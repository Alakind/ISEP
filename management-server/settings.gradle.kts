plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.5.0"
}
rootProject.name = "management-server"
include("src:test:ut.isep.management")
findProject(":src:test:ut.isep.management")?.name = "ut.isep.management"
include("test")
