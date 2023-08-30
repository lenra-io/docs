---
name: Create a project
---

## New project

Once the [Lenra CLI is installed](./install.html), you can use it to create a new Lenra app.

{:.or}
- ### from **a template**

    Creating an app from a template is the easiest way to start.
    The Lenra templates are just git repositories with a basic app that implements the Lenra app API.

    You can find the list of available templates [{:rel="noopener" target="_blank"}here](https://github.com/search?q=topic%3Alenra+topic%3Atemplate&sort=stargazers&type=repositories).

    To create a new Lenra project you can just run the [`lenra new` command](../references/cli/commands/new.html).
    Pass a list of GitHub topics to find the list of corresponding templates.
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

    #### Maintained by the **Lenra team**

    We have created a few templates to help you start your next project.

    {:#templates}
    - [{:.btn rel="noopener" target="_blank"}![JavaScript](/img/languages/javascript.svg)](https://github.com/lenra-io/template-javascript)
    - [{:.btn rel="noopener" target="_blank"}![TypeScript](/img/languages/typescript.svg)](https://github.com/lenra-io/template-typescript)
    - [{:.btn rel="noopener" target="_blank"}![Rust](/img/languages/rust.svg)](https://github.com/lenra-io/template-rust)
    - [{:.btn rel="noopener" target="_blank"}![Python](/img/languages/python.svg)](https://github.com/lenra-io/template-python)
    - {:.soon}
        [{:.btn rel="noopener" target="_blank"}![PHP](/img/languages/php.svg)](https://github.com/lenra-io/template-php)
    - {:.soon}
        [{:.btn rel="noopener" target="_blank"}![Elixir](/img/languages/elixir.svg)](https://github.com/lenra-io/template-elixir)

- ### from **scratch**

    If you don't find a template that fits your needs or you want to better understand how it works, you can create a new Lenra app from scratch.

    [{:.btn.link}Read the specific guide for that](../guides/create-from-scratch.html)


## Start **developing**

Now that you have a new Lenra app project, you can start developing it.
Be shure you've understand the [Lenra principles](../guides/principles.html) before starting.


[{:.btn.link.lenra-icon-arrow-right}Look at our todo list app guide](../guides/todo-list-app.html)