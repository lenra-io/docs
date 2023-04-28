---
description: How to create a first app ? Look at this guide to understand how to create your first Lenra app.
---

Welcome to this guide on how to create your first application using Lenra technology.
In this guide, we will take you through the process of building an application that works similar to the provided application templates.
Whether you are a beginner or have some experience in programming, this guide will help you create your own functional application with ease.

Lenra is a cutting-edge technology that provides developers with the ability to create applications that are efficient, reliable, and scalable.
With Lenra, you can build applications for a wide range of purposes, including web applications, mobile applications, and desktop applications.

This guide assumes that you have some basic knowledge of programming concepts and are familiar with at least one programming language.
Make shure that you have [installed the Lenra CLI](../getting-started/index.md) and that you are in a Lenra project ([you can create one from scratch](./create-from-scratch.md))
We will be using JavaScript as the primary language for this guide, but you can use any language of your choice as Lenra is language-agnostic.

So, if you are ready to embark on the journey of building your first Lenra application, let's get started!


## Our first view: a counter

First we'll create the counter view.
It purpose is to display the value of a counter in a [text component](/references/components-api/components/text.html) and define a [button](/references/components-api/components/button.html) to inscrement it.
We'll put them together in a [flex component](/references/components-api/components/flex.html).

```javascript
import { Flex, Text, Button } from "@lenra/components";

/**
 * @param {import("@lenra/app-server").data} _data 
 * @param {import("@lenra/app-server").props} _props 
 * @returns 
 */
export default function (_data, _props) {
  const count = 0;
  return Flex([
    Text(`Counter value: ${count}`),
    Button("+")
  ])
    // add some space between the children
    .spacing(16)
    // 
    .mainAxisAlignment("spaceEvenly")
    .crossAxisAlignment("center")
}
```



<!-- TODO: home -->
<!-- TODO: menu + main -->
<!-- TODO: common counter -->