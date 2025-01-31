# 6. Front end programming language

Date: 2024-11-26

## Status

Accepted

## Context

The team and application is split between the back end and the front end. We need to choose
a coding language for the front end that allows our front-end team to be productive, and ensures
that the product is reliable and maintainable for the client's developers.

## Decision

The options are standard javascript, Angular, Vue, and React. Angular was rejected due to it being a heavyweight
framework in combination with the project requiring an efficient and fast frontend. Our frontend developers had
primarily experience with React, which is the decisive reason it was chosen over Vue.

For the logic in frontend the alternatives are Javascript or Typescript. Typescript is object oriented while Javascript
is more limiting in an object-oriented implementation. Since React is object oriented with reusable functions Typescript
felt like the better match. Another reason why typescript is chosen is the typesafety. It limits the potential for
non type-safe code, resulting in less compilation errors.

## Consequences

The reusable components of React are beneficial for reusability and modularity. For example, the applicant table ion
the management view can be reused in both the dashboard and user page as it is a function that can be called. This gives
less duplicated code and allows for a structure of various components that are used to populate a page.