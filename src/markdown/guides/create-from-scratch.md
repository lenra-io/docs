---
title: Create an app from scratch
description: We've created many templates for creating a Lenra app using the 'lenra new' command but this guide explain how to create one from scratch.
---

We've created [many templates](../getting-started/create-project.html#createwithyourfavoritelanguage) for creating a Lenra app using the [`lenra new` command](/references/cli/commands/new.html).
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
# define the project type as module
npm pkg set type='module'
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

We can now define two npm scripts:
```bash
# Start the app server
npm pkg set scripts.start='app-lenra'
# Index the views and listeners to have autocompletion
npm pkg set scripts.index='app-lenra index'
```


### Components lib

The second library is the components lib that contains [the interface components](../references/components-api/components/) to create the views.
It adds autocompletion and it's simpler to describe the views compared to describing it as JSON.

You can find one for your favorite language [on GitHub](https://github.com/search?q=topic%3Acomponents-lib+topic%3Alenra&type=Repositories).

```bash
npm i @lenra/components
```

## Creation of the app

Now that your project is configured we will define your app manifest and your first view.

### The manifest and system listeners

The manifest describe some static values for your app, like the root view.
The app-lib manage the manifest by importing the `src/manifest.js` file.

```bash
mkdir src
echo 'export const rootView = "hello";' > src/manifest.js
```

We also will define a file containing the Lenra's system events that must be implemented by the apps:

```bash
mkdir -p src/listeners
echo 'export async function onEnvStart(_props, _event, api) {
    // this event is dispatched when your app is deployed
}

export async function onUserFirstJoin(_props, _event, api) {
    // this event is dispatched when a user joins your app for the first time
}

export async function onSessionStart(_props, _event, _api) {
    // this event is dispatched when a user starts using your app
}' > src/listeners/systemEvents.js
```

### Your first view

We will now create the first view of our app in the file `src/views/hello.js`.
The app-lib will manage all the exported functions in the `src/views` directory as views and in the `src/listeners` directory as listeners.
This view will only display the text `Hello world` in the center of the screen.

```bash
mkdir -p src/views
echo 'import { Container, Text } from "@lenra/components";

export default function (_data, _props) {
    return Container(
        Text("Hello World")
    ).alignment("center")
}' > src/views/hello.js
```

Start your app server with the next command:

```bash
npm start
```

You can now test your app by like that:

```bash
# with wget
wget -q --output-document - --post-data='{"view": "hello"}' --header='Content-Type:application/json' http://localhost:3000/
# with curl
curl --header "Content-Type: application/json" --request POST --data '{"view": "hello"}' http://localhost:3000/
```

You should receive the next response:
```json
{"type":"container","child":{"type":"text","value":"Hello World"},"alignment":"center"}
```

## Packaging your app

Now that your app works (even if it's a basic app it's still an app) we will create the `lenra.yml` file.
It describes how to package your app and run it.

To get more informations about how to create this file, see [the dedicated page](../references/cli/config-file.html).

For this guide we will just use the JavaScript template's one explaining it:

```bash
echo '# Your app generator
generator:
  # Using the dofigen generator
  dofigen:
    builders:
      # creation of a build that will only install the dependencies to keep some cache
      - from: "docker.io/bitnami/node:18"
        workdir: /app
        # change the /app directory owner
        root:
          script:
            - chown -R 1000 /app
        # add json files
        adds:
          - "*.json"
        # install the dependencies
        script:
          - npm ci
    # the main layer based on the previous builder
    from: builder-0
    # add all the files of the context
    adds:
      - .
    # define how to start the app
    cmd:
      - npm
      - start
    # the exposed port of your app
    ports:
      - 3000
    healthcheck:
      cmd: curl --fail http://localhost:8080/_/health
      start: 3s
      interval: 3s
      timeout: 1s
    # manage elements ignored from the Docker build context
    ignores:
      - "**"
      - "!/*.json"
      - "!/src/"' > lenra.yml
```

You can know test your app with our CLI:

```bash
lenra dev
```
