# Prototypal OO
The original code behind this was originally written by Eric Elliot Fluent during his talk, JavaScript Part 1: Prototypal OO.

I made a lot of annotations, edits and additions to help out any Javascript adventurer, just like me, to learn to digest good stuff of Javascript!

Go ahead and read up on the `fluent-javascript.js` file to see the good stuff.

## Prototypal vs Classical Inheritance
Javascript does prototypal inheritance. Unlike classical inheritance languages like Java, Javascript does not have classes. Instead, everything in Javascript can be an object (even primitives like Numbers, Booleans and Strings). These objects can inherit from each other through the prototypal chain. All prototypal chains end at Object.prototype. Objects inherit everything that are in the prototype chain, but those that are lower (closer to the object) in the prototype chain have higher precedence.

Avoid having very deep prototype chains, or your lookup times can suffer!

## Why avoid Constructor Functions?
Constructor functions simulate a lot of things that class-like languages like Java does for you. However, as Eric Elliot presents in this talk and code, factory functions are way more powerful than constructor functions.