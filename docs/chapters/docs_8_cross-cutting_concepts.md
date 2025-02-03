# 8. Cross-cutting Concepts

## 8.1. Data Transfer Objects

Since we are creating a web-based application, we have to deal with data transfer
between the different components via the internet. To create consistency we defined
the transfer of data with Data Transfer Objects (DTO's). These DTO's are Kotlin
Data object which can be automatically transcribed to JSON data. Since we are
dealing with a repository as part of our network. These DTO's must be available for
the main repository and the questions repository. That is why the DTO's are in a
separate repository which is included as a git submodule in both repositories.

## 8.2. REST API

For communication between components we make use of a REST API.
