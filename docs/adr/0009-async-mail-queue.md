# 9. Async Mailing Queue

Date: 2024-11-26

## Status

Accepted

## Context

WHen sending a mail request the system will get stuck in the request until the mail is sent.

## Decision

asynchronous implementation that freezes the backend, especially when multiple mails are sent. It then denies futures
requests until current mails are processed.

message/mail queue is an alternative. Restpoint API looks like a decent alternative, however it is a disguised
asynchronous system, so the implementation did not seem logical to us. For the current system and the expected use of
the
mail system we deemed the complexity not needed.

## Consequences

The asynchronous implementation can freeze the backend, when multiple mails are sent, since it will wait until it has
been sent, denying future requests. The worker is async as it is ‘busy’ with that. Database is synchronous as otherwise
you get state errors.

Optimally you would want a mail communication history. If a mail is pending, have statuses for if it is sent
successfully
or creates an error. Since in the deployment the Infosupport mailing service will be used we implemented this async
solution. A
better solution is low priority since the current implementation will be replaced regardless.
