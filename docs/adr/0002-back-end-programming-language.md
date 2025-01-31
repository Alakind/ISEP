# 2. Back end programming language

Date: 2024-11-26

## Status

Accepted

## Context

The team and application is split between the back end and the front end. We need to choose
a coding language for the back end that allows our back-end team to be productive, and ensures 
that the product is reliable and maintainable for the client's developers. 


## Decision

The client suggested Java/C#/TypeScript as options due to their in-house development teams adopting these languages.
Additionally, the previously developed prototype was developed in TypeScript and ran on a Node server. However, all of 
the team's experienced TypeScript programmers had formed the front-end team, and no back-end programmers had substantial 
experience working with C#. The team initially settled on Java, but "upgraded" to Kotlin after the client confirmed that 
there are also Kotlin teams in InfoSupport.

The final switch to Kotlin was based on perceived quality-of-life improvements versus Java: null safety, excellent functional
programming support, and concise syntax. Additionally, our back-end developers were quite familiar with Java and felt that
working with Kotlin for a larger project would be a great learning experience.

## Consequences

Learning the idiomatic ways to develop certain functions in Kotlin might slow our developers down in the short term, but 
we believe that Kotlins superset of Java features will prove to be useful as the project goes on.