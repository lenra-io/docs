---
name: Create a project
---

## New Lenra app

Once the [Lenra CLI is installed](./install.html), you can use it to create a new Lenra app.

{:.or}
- ### from **a template**

    Creating an app from a template is the easiest way to start.
    The Lenra templates are just git repositories with a basic app that implements the Lenra app API.

    You can find the list of [{:rel="noopener" target="_blank"}available templates on GitHub](https://github.com/search?q=topic%3Alenra+topic%3Atemplate&sort=stargazers&type=repositories).

    {:#templates}
    - ![JavaScript](/img/languages/javascript.svg)
    - ![TypeScript](/img/languages/typescript.svg)
    - ![Rust](/img/languages/rust.svg)
    - ![Python](/img/languages/python.svg)
    - {:.soon}
        ![PHP](/img/languages/php.svg)
    - {:.soon}
        ![Elixir](/img/languages/elixir.svg)

    To create a new Lenra project you can just run the [`lenra new` command](../references/cli/commands/new.html).
    Pass a list of GitHub topics to find the list of corresponding templates (for example the language you want to use).
    If none is specified, the CLI will let you choose in the full list.
    You also can specify the name of a target directory for the new app with the `--path` option.

    ```bash
    # new app from javascript template in a new 'my-app' directory
    lenra new javascript --path my-app
    # move to the new app dir
    cd my-app
    # initialize git versionning
    git init
    # start your app
    lenra dev
    ```


- ### from **scratch**

    If you don't find a template that fits your needs or you want to better understand how it works, you can create a new Lenra app from scratch.

    [{:.btn.link}Read the specific guide for that](../guides/create-from-scratch.html)


## Start developing

Now that you have a new Lenra app project, you can start developing it.
Make sure you've understood the [Lenra principles](./principles.html) before starting since Lenra is a bit different from classic frameworks.

### Features

One of the most important thing to know with Lenra is how to [manage data](../features/data-management.html).

Find all the features you need for your app in the [{:.btn.link.lenra-icon-arrow-right}features list](../features/)

### Guides

There is also [some guides](../guides/) that can explain you the next steps for creating your app.

<!-- TODO: add showcase app when it's ready -->

You should look at our [{:.btn.link.lenra-icon-arrow-right}app guides](../guides/apps/)