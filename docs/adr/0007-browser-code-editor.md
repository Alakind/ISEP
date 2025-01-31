# 7. Browser Code Editor

Date: 2024-11-26

## Status

Accepted

## Context

For coding questions a browser-integrated code editor needs to be developed. This code editor needs to have
intellisense/auto-complete as well as the ability to execute code and tests. Due to the scope of the project and
technical complexity of developing one, we opted for working with an existing one. The rabit-hole of choosing from the
alternatives is deep, involving many tradeoffs.

## Decision

The options considered are Monaco, Ace and Code Mirror.

Monaco is a fully featured code editor based on the VSCode API, the major downsides ate it's size and resource intensity.
This is due to built in the language support protocol (LSP). Ace and CodeMirror do not have this, which is a pro for
Monaco, however due to focus on high performance we deemed it too heavyweight for our use case.

Ace has snippets and auto-completion built in. It is customizable, but less feature rich than
Monaco. This makes it more light weight. Choosing this over Monaco means a lighter-weight, but less features. the hard
to implement features are diagnostics, in-depth IntelliSense, or seamless external integrations. The important
limitation for our project is the IntelliSense.

Code Mirror has a modular architecture that makes it the most light weight of the three, but the modular architecture
requires more manual configuration to set it up properly. This learning curve and smaller ecosystem gave the preference
to the other two alternatives.

The LSP was not working correctly with editors other than Monaco, so we decided to develop with Ace as it has a simple
version of autocompletion built in. We chose for Ace as it had the best performance (not based on VSCode base).

## Consequences

By choosing Ace the autocompletion is more challenging to implement than if we chose Monaco, but in trade for faster
performance.

A constraint of the project is the lack of proper LSP. It is advised to take the time to research the proper integration
of a LSP-based solution for more in-depth autocompletion. However this needs to be done with monitoring the performance
as well, considering the trade-off between completeness vs performance. In our solution we preferred the performance.
