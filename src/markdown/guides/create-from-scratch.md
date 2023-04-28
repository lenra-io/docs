---
title: Create an app from scratch
description: We've created many templates for creating a Lenra app using the 'lenra new' command but this guide explain how to create one from scratch.
---

We've created [many templates](/getting-started/create-project.html#createwithyourfavoritelanguage) for creating a Lenra app using the [`lenra new` command](/references/cli/commands/new.html).
Here is how you can configure a Lenra app project from scratch.

This guide assumes that you have some basic knowledge of programming concepts and are familiar with at least one programming language.
We will be using JavaScript as the primary language for this guide, but you can use any language of your choice as Lenra is language-agnostic.

## Initialise the directory

We'll first create a new directory that will contain our app and initialize git and npm in it.

```bash
# create a new directory for your app
mkdir my-app
# go into it
cd my-app
# initialize git versionning (always good ^^)
git init
# initialize npm project
npm init
```

## Import dependencies

To make the app creation simpler we've created two libraries.

### App lib

The first library is the app lib that contains all the elements to run the application and call the Lenra API.
This makes the Lenra app simpler to understand since only the views, listeners and resources are kept in the app sources.

You can find one for your favorite language [on GitHub](https://github.com/search?q=topic%3Aapp-lib+topic%3Alenra&type=Repositories).

```bash
npm i @lenra/app-server
```


### Components lib

The second library is the components lib that contains obviously the interface components to create the views.
It adds autocompletion and it's simpler to describe the views compared to describing it as JSON.

You can find one for your favorite language [on GitHub](https://github.com/search?q=topic%3Acomponents-lib+topic%3Alenra&type=Repositories).

```bash
npm i @lenra/components
```

