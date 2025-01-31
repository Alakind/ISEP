# 1. Record architecture decisions

Date: 2024-11-26

## Status

Accepted

## Context

To speed up the development of the front-end, we are using pre-built CSS boiler-plate. We have two frameworks to choose
from: Bootstrap and Tailwind.
Bootstrap is older than Tailwind and has a lot of documentation and support behind it, making it easy for debugging.
Tailwind provides simple smaller classes for positioning and scaling elements and handling responsiveness.

## Decision

We wanted more customisation over pages ourselves, which from our experience was easier with bootstrap.
In Tailwind some components are not free, despite looking cleaner. This in combination with bootstrap experience swayed
us to use Bootstrap.

## Consequences

The consequences are minor, since bootstrap is not used much. It is used to implement various icons and custom
components (buttons, loading bars, tables). It is used sparingly to allow for more control as designers.

In hindsight Tailwind might have made some components easier to implement, for example tables.


