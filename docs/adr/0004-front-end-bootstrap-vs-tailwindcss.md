# 1. Record architecture decisions

Date: 2024-11-26

## Status

Accepted

## Context

To speed up the development of the front-end, we are using pre-built CSS boiler-plate. We have two frameworks to choose from: Bootstrap and Tailwind.

Bootstrap is older than Tailwind and has a lot of documentation and support behind it, making it easy for debugging.

Tailwind provides simple smaller classes for positioning and scaling elements and handling responsiveness.

## Decision

-we went for bootstrap since.they are the same thing, but tailwind is higher level of abstraction. Bootstrap is closer to CSS. It is miore readable as due to the similarity to CSS.

## Consequences

See Michael Nygard's article, linked above. For a lightweight ADR toolset, see Nat Pryce's [adr-tools](https://github.com/npryce/adr-tools).
