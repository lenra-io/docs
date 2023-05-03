---
name: Create an app from scratch
description: We've created many templates for creating a Lenra app using the 'lenra new' command but this guide explain how to create one from scratch.
---

Welcome to this guide on how to create your first application using Lenra technology.
In this guide, we will take you through the process of building an application that works similar to the provided application templates.
Whether you are a beginner or have some experience in programming, this guide will help you create your own functional application with ease.

Lenra is a cutting-edge technology that provides developers with the ability to create applications that are efficient, reliable, and scalable.
With Lenra, you can build applications for a wide range of purposes, including web applications, mobile applications, and desktop applications.

This guide assumes that you have some basic knowledge of programming concepts and are familiar with at least one programming language.
We will be using JavaScript as the primary language for this guide, but you can use any language of your choice as Lenra is language-agnostic.

So, if you are ready to embark on the journey of building your first Lenra application, let's get started!

<!-- {:.list}
[toc] -->

## Project configuration

### Initialise the directory

We'll first create a new directory that will contain our app and initialize git and npm in it.

```bash
# create a new directory for your app
mkdir my-app
# go into it
cd my-app
# create the views directory
mkdir -p src/views
# create the listners directory
mkdir -p src/listeners
# create the classes directory
mkdir -p src/classes
# create the resources directory
mkdir -p src/resources
```

```bash
# ignore some elements
echo '### Node
node_modules/
.npm
.config
.DS_Store
.lenra/' > .gitignore
# initialize git versionning
git init
```

```bash
# initialize npm project
npm init -y
# define the project type as module
npm pkg set type='module'
```

You can now open the project in your favorite IDE:

```bash
code .
```

### Import dependencies

To make the app creation simpler we've created two libraries.

#### App lib

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


#### Components lib

The second library is the components lib that contains [the interface components](../references/components-api/components/) to create the views.
It adds autocompletion and it's simpler to describe the views compared to describing it as JSON.

You can find one for your favorite language [on GitHub](https://github.com/search?q=topic%3Acomponents-lib+topic%3Alenra&type=Repositories).

```bash
npm i @lenra/components
```

### Creation of the app

Now that your project is configured we will define your app manifest and your first view.

#### The manifest and system listeners

The manifest describe some static values for your app, like the root view.
The app-lib manage the manifest by importing the `src/manifest.js` file.

{:data-file="src/manifest.js"}
```javascript
export const rootView = "hello";
```

We also will define a file containing the Lenra's system events (`src/listeners/systemEvents.js`) that must be implemented by the apps:

{:data-file="src/listeners/systemEvents.js"}
```javascript
export async function onEnvStart(_props, _event, api) {
    // this event is dispatched when your app is deployed
}

export async function onUserFirstJoin(_props, _event, api) {
    // this event is dispatched when a user joins your app for the first time
}

export async function onSessionStart(_props, _event, _api) {
    // this event is dispatched when a user starts using your app
}
```

#### Your first view

We will now create the first view of our app in the file `src/views/hello.js`.
The app-lib will manage all the exported functions in the `src/views` directory as views and in the `src/listeners` directory as listeners.
This view will only display the text `Hello world` in the center of the screen.

{:data-file="src/views/hello.js"}
```javascript
import { Container, Text } from "@lenra/components";

export default function (_data, _props) {
    return Container(
        Text("Hello World")
    ).alignment("center")
}
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

### Packaging your app

Now that your app works (even if it's a basic app it's still an app) we will create the `lenra.yml` file.
It describes how to package your app and run it.

To get more informations about how to create this file, see [the dedicated page](../references/cli/config-file.html).

For this guide we will just use the JavaScript template's one explaining it:

{:data-file="lenra.yml"}
```yaml
componentsApi: "1.0"
# Your app generator
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
      - "!/src/"
```

You can now run the [`lenra dev` command](../references/cli/commands/dev/) to build and start your app, and your terminal will enter an interactive mode.
In this mode, you will see your app's logs and will be able to run commands with keyboard shortcuts (we'll use one later).

```bash
lenra dev
```

To see your app, just go to [{:target="_blank" rel="noopener"}localhost:4000](http://localhost:4000/)

Great ! You've created an hello world app !
Let's see how to manage the views and data by adapting it to get the template counter app.

## The application elements

Now that we have a basic app we will implement our counter app elements.

### The counter view

First we'll create the counter view.
It purpose is to display the value of a counter in a [text component](/references/components-api/components/text.html) and define a [button](/references/components-api/components/button.html) to inscrement it.
We'll put them together in a [flex component](/references/components-api/components/flex.html).

Let's define it in the new `src/views/counter.js` file:

{:data-file="src/views/counter.js"}
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

{:data-file="src/manifest.js"}
```javascript
export const rootView = "counter";
```

To reload (rebuild and restart) your app just press the `R` key while your terminal is in interactive mode.

You will see your counter, but nothing happen when you click on the button.
Of course, we've defined the counter value with a constant value of 0.
Let's see how to dynamise it.

### The counter data

To dynamise our counter view we will need to manage a state to it.
With Lenra manage a state, you will need to store it in the MongoDB database of your app.

To manage your app data you will need to use our API from a listener.
The JavaScript app-lib eases the data management by using classes.

#### The `Counter` class

We will create a new class file, `src/classes/Counter.js`, for the `Counter` class:

{:data-file="src/classes/Counter.js"}
```javascript
import { Data } from "@lenra/app-server";

export class Counter extends Data {
    /**
     * 
     * @param {string} user 
     * @param {number} count 
     */
    constructor(user, count) {
        super();
        this.user = user;
        this.count = count;
    }
}
```

Counter class contains two fields:
- `count`: the counter value.
- `user`: the user that own the counter. We will use it later.


#### Create the global counter

We will use the system event listeners that [we've created in the first part of this guide](#the-manifest-and-system-listeners) to create our first counter with the `user` field defined to `"global"`.

Edit the `src/listeners/systemEvents.js` to implement the `onEnvStart` listener:

{:data-file="src/listeners/systemEvents.js"}
```javascript
import { Counter } from "../classes/Counter.js";

/**
 * This event is dispatched when your app is deployed
 * @param {import("@lenra/app-server").props} _props 
 * @param {import("@lenra/app-server").event} _event 
 * @param {import("@lenra/app-server").Api} api 
 */
export async function onEnvStart(_props, _event, api) {
    // get the global counters
    const counters = await api.data.find(Counter, { user: "global" })
    // if there is none, create one
    if (counters.length == 0) {
        await api.data.createDoc(new Counter("global", 0));
        console.log("Global counter created");
    }
}

export async function onUserFirstJoin(_props, _event, api) {
    // this event is dispatched when a user joins your app for the first time
}

export async function onSessionStart(_props, _event, _api) {
    // this event is dispatched when a user starts using your app
}
```

Since the event we use to create our first counter is only dispatched when the app is deployed, to dispatch it locally we have to stop our app and start it again.

If your in the interactive mode, just press the `S` key to stop it.
All your container will stop et the data will be cleared.

You can now re-start your app with `lenra dev`.

Refresh your app in your browser to see the log that we've added in your app logs: `Global counter created`

Great, the data is created, but how to use it ?

#### Make the view dynamic

Now that we have a global counter data we will use it in our counter view.
To use data in a view you have to query it in your view declaration.

Our first step is to create a parent view to declare our counter view with the query.
We also give a `text` property to our view.

Let's create the new `src/views/home.js` file and set it as the root view:

{:data-file="src/views/home.js"}
```javascript
import { DataApi } from "@lenra/app-server";
import { View } from "@lenra/components";
import { Counter } from "../classes/Counter.js";

export default function (_data, _props) {
    return View("counter")
        .data(DataApi.collectionName(Counter))
        .props({ text: "The common counter" })
}
```

{:data-file="src/manifest.js"}
```javascript
export const rootView = "home";
```

We'll now adapt our counter view to use the response of the query and the given `text` property.
We also will call an `increment` listener with the counter id in the the `id` property when the button is pressed:

{:data-file="src/views/counter.js"}
```javascript
import { Flex, Text, Button } from "@lenra/components";

/**
 * 
 * @param {import("../classes/Counter").Counter[]} param0 
 * @param {import("@lenra/app-server").props} param1 
 * @returns 
 */
export default function ([counter], { text }) {
    return Flex([
        Text(`${text}: ${counter.count}`),
        Button("+")
            .onPressed("increment", { id: counter._id })
    ])
        // add some space between the children
        .spacing(16)
        // define how the elements are positionned
        .mainAxisAlignment("spaceEvenly")
        .crossAxisAlignment("center")
}
```

Let's implement the `increment` listener.

#### The `increment` listener

Now that your counter view is based on your counter data we will implement the `increment` listener to increment the given counter `count` field in a new `src/listeners/increment.js` file:


{:data-file="src/listeners/increment.js"}
```javascript
import { Counter } from "../classes/Counter.js";

/**
 * 
 * @param {import("@lenra/app-server").props} props 
 * @param {import("@lenra/app-server").event} _event 
 * @param {import("@lenra/app-server").Api} api
 * @returns 
 */
export default async function(props, _event, api) {
    // Get the wanted counter data
    let counter = await api.data.getDoc(Counter, props.id);
    // increment the count field
    counter.count += 1;
    // update the data in the base
    await api.data.updateDoc(counter);
}
```

If you reload your app (press `R` key), you'll now have a working counter.

### A user specific counter

Now that we have a working counter we will create another one but this time it will be specific to the current user.
To target the current user while managing data with Lenra you can use the `@me` keyword that will be replaced by the current user id.

Let's create the data when the user join the app for the first time by editing our `src/listeners/systemEvents.js` file:

{:data-file="src/listeners/systemEvents.js"}
```javascript
import { Counter } from "../classes/Counter.js";

/**
 * This event is dispatched when your app is deployed
 * @param {import("@lenra/app-server").props} _props 
 * @param {import("@lenra/app-server").event} _event 
 * @param {import("@lenra/app-server").Api} api 
 */
export async function onEnvStart(_props, _event, api) {
    // get the global counters
    const counters = await api.data.find(Counter, { user: "global" })
    // if there is none, create one
    if (counters.length == 0) {
        await api.data.createDoc(new Counter("global", 0));
        console.log("Global counter created");
    }
}

/**
 * This event is dispatched when a user joins your app for the first time
 * @param {import("@lenra/app-server").props} _props 
 * @param {import("@lenra/app-server").event} _event 
 * @param {import("@lenra/app-server").Api} api 
 */
export async function onUserFirstJoin(_props, _event, api) {
    // get the current user counters
    const counters = await api.data.find(Counter, { user: "@me" })
    // if there is none, create one
    if (counters.length == 0) {
        await api.data.createDoc(new Counter("@me", 0))
        console.log("User counter created");
    }
}

export async function onSessionStart(_props, _event, _api) {
    // this event is dispatched when a user starts using your app
}
```

Now we adapt the home view to have the two counters (user specific and global) and some layout:

{:data-file="src/views/home.js"}
```javascript
import { DataApi } from "@lenra/app-server";
import { Flex, View } from "@lenra/components";
import { Counter } from "../classes/Counter.js";

export default function (_data, _props) {
    return Flex([
        View("counter")
            .data(DataApi.collectionName(Counter), { user: "@me" })
            .props({ text: "My personnal counter" }),
        View("counter")
            .data(DataApi.collectionName(Counter), { user: "global" })
            .props({ text: "The common counter" }),
    ])
}
```

If you reload your app now, you'll have a problem since the current user you're making your tests with has already joined the app.
To resolve this, you can also implement the `onSessionStart` listener to check every time the user start the app that there is a counter for him or stop and restart your Lenra app to clear the data.

To explain how to test your like there is many users we will use a third solution: giving a user in the URL wth the `user` query param.

[{:target="_blank" rel="noopener"}localhost:4000?user=2](http://localhost:4000/?user=2)

If you want to try with more users just increment the `user` query param.
By opening many tabs ou will see that when you increment the common counter it will automatically update the value for all the tabs at the same time.
It works the same way for the user specific counter if open many tabs with the same value for the `user` query param.

### Let's add some layout and autocompletion

Now that we have a working app we will make it a little prettier by adding some layout.
But let's use the indexer to target our views and listeners with autocompletion.

To index your app elements you just have to run the next command:

```bash
npm run index
```

This command will generate a `src/index.gen.js` file that contains some constants with the names of your views and listeners.

We now can use it by importing the file in our modules.

Let's add some layout to our home view and replace the counter view name by the constant:

{:data-file="src/views/home.js"}
```javascript
import { DataApi } from "@lenra/app-server";
import { Flex, View } from "@lenra/components";
import { Counter } from "../classes/Counter.js";
import { views } from "../index.gen.js";

export default function (_data, _props) {
    return Flex([
        View(views.counter)
            .data(DataApi.collectionName(Counter), { user: "@me" })
            .props({ text: "My personnal counter" }),
        View(views.counter)
            .data(DataApi.collectionName(Counter), { user: "global" })
            .props({ text: "The common counter" }),
    ])
        .direction("vertical")
        .spacing(16)
        .mainAxisAlignment("spaceEvenly")
        .crossAxisAlignment("center")
}
```

Now we will create a top menu bar containing the Lenra logo and a centered title:

{:data-file="src/views/menu.js"}
```javascript
import { Container, Flex, colors, padding, Image, Flexible, Text } from "@lenra/components";

export default function(_data, _props) {
  return Container(
    Flex([
      Container(
        Image("logo.png")
      )
        .width(32)
        .height(32),
      Flexible(
        Container(
          Text("Hello World")
            .textAlign("center")
            .style({
              "fontWeight": "bold",
              "fontSize": 24,
            })
        )
      )
    ])
      .fillParent(true)
      .mainAxisAlignment("spaceBetween")
      .crossAxisAlignment("center")
      .padding({ right: 32 })
  )
    .color(colors.Colors.white)
    .boxShadow({
      blurRadius: 8,
      color: 0x1A000000,
      offset: {
        dx: 0,
        dy: 1
      }
    })
    .padding(padding.symmetric(32, 16))
}
```

Download the Lenra logo like that: 

```bash
wget -O src/resources/logo.png https://raw.githubusercontent.com/lenra-io/template-javascript/main/src/resources/logo.png
```

Now we can create a main view that contains our menu and home view:

{:data-file="src/views/main.js"}
```javascript
import { Flex, View } from "@lenra/components";
import { views } from "../index.gen.js";

export default function (_data, _props) {
  return Flex([
    View(views.menu),
    View(views.home)
  ])
    .direction("vertical")
    .scroll(true)
    .spacing(4)
    .crossAxisAlignment("center")
}
```

And that's it !
Your template app is finished.

You can test with the [`lenra check template` command](../references/cli/commands/check/template.html).

From the interactive mode of Lenra CLI press `Ctrl + C` to enter in the Lenra terminal.
You can now run directly Lenra commands like those ones:

```bash
# Expose your application port (always 8080)
expose app
# check the template
check template
```
