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

Let's define it in the `src/views/couonter.js` file:

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
    // define how the elements are positionned
    .mainAxisAlignment("spaceEvenly")
    .crossAxisAlignment("center")
}
```

To see it, we need to define the `rootView` field in the `src/manifest.js` at the value `"counter"`.

You can now run the `lenra dev` command to build and start your app, and your terminal will enter an interactive mode.
In this mode, you will see your app's logs and will be able to run commands with keyboard shortcuts (we'll use one later).

To see your app, just go to http://localhost:4000/

You will see your counter, but nothing happen when you click on the button.
Of course, we've defined the counter value with a constant value of 0.
Let's see how to make it dynamic.

<!-- TODO: home + global counter data and listener -->
<!-- TODO: menu + main -->
<!-- TODO: user counter -->