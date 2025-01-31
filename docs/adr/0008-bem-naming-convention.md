# 8. BEM Naming Convention

Date: 2024-11-26

## Status

Accepted

## Context

For styling elements we use CSS. The complexity of the amount of style classes became quickly disorganized. Some
organization is vital to keep the code readable and limit technical depth.

## Decision

Since naming conventions are protocols and most work well as long they are consistent, we didn't take much time to look
at alternatives. The decision is low impact as it is essentially a naming convention. BEM in particular is excellent for
quickly identifying what a components is, followed by efficiently navigating to the right styling components, as from
the CSS styling it easy to see what it should look like.

## Consequences

The consequences are more readable styling classes, where it is clear which styling belongs to which element. This does
not necessarily make the react components easier to navigate, but it does simplify an abstraction layer. This naming
convention could be extended to other aspects of the frontend.
