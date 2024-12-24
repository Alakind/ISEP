# 5. questions cached in database or queried from repository

Date: 2024-12-24

## Status

In active discussion.

## Context


### Current status
The client requires us to provide a repository from where questions can be created, updated and deleted using git
commits.
These questions need to be compiled into fully fledged assessments based on tags indicating which section and assessment
they belong to. At the moment of writing this, the repository contains a parser that can parse the entire repository to 
create JPA entities for all multiple-choice and open assignments, found within it.  

### Coding assignments
In order to store coding assignments, which can come with different files and an entire directory structure, it would be 
sensible to store them in a file storage, rather than our PostgreSQL database. We considered Azure Cloud File Storage,
but why not simply query the file storage system we are already using: GitHub? We could use git commit hashes to directly
point towards the right version of a question, without having to store the entire file as a separate database entity. 

### Limitations
The GitHub api allows for 5000 free requests per hour, which should be plenty for a few dozen of simultaneous applications, but it's harder to estimate the 
amount of requests that 

### Should we generalize this approach to all assignments

## Decision

The change that we're proposing or have agreed to implement.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
