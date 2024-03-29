---
name: Create an Lenra template from scratch
description: We've created many templates for creating a Lenra app using the 'lenra new' command but this guide explains how to create one from scratch.
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

### Initialize the directory

We'll first create a new directory that will contain our app:

```bash
# create a new directory for your app
mkdir my-app
# go into it
cd my-app
# create the views directory
mkdir -p src/views/lenra
# create the listners directory
mkdir -p src/listeners
# create the classes directory
mkdir -p src/classes
# create the resources directory
mkdir -p src/resources
```

Initialize git:

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

And initialize npm:

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

To make the app creation simpler we've created a library that let you define your app resources, but will manage the rest.

You can find equivalent libraries for your favorite language [{:rel="noopener" target="_blank"}on GitHub](https://github.com/search?q=topic:app-lib+topic:lenra&type=Repositories).

For JavaScript, we've created the `@lenra/app` library that contains the app server and the Lenra API client and Lenra components for both JSON views and Lenra views (still in beta).

```bash
npm i @lenra/app
```

We can now define two npm scripts:

```bash
# Start the app server
npm pkg set scripts.start='app-lenra'
# Index the views and listeners to have autocompletion
npm pkg set scripts.index='app-lenra index'
```

### Creation of the app

Now that your project is configured we will define your app manifest and your first view.

#### The manifest and system listeners

The manifest describes some static values for your app, like the routes and there corresponding views.
The app-lib manages the manifest by importing the `src/manifest.js` file.

There is two kind of routes and views in Lenra apps:

- the JSON routes and views that are defined in the `json` field of the manifest.
- the Lenra routes and views that are defined in the `lenra` field of the manifest.

If you want to know more about the views differences, see [the principles page](../getting-started/principles.html#views-1).

The app templates use both kind routes and views, but you can use only one of them if you want.

{:data-file="src/manifest.js"}

```javascript
import { View } from "@lenra/app";

/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/hello",
            view: View("hello")
        }
    ]
};

/**
 * @type {import("@lenra/app").Manifest["lenra"]}
 */
export const lenra = {
    routes: [
        {
            path: "/",
            view: View("hello")
        }
    ]
};
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

We will now create the first view of our app in the file `src/views/hello.js` that will be used by both Lenra and JSON routes.
The app-lib will manage all the exported functions in the `src/views` directory as views and in the `src/listeners` directory as listeners.
This view will only display the text `Hello world` in the center of the screen.

{:data-file="src/views/hello.js"}

```javascript
import { Container, Text } from "@lenra/app
```

Start your app server with the following command:

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

You should receive the following response:

```json
{"_type":"container","child":{"_type":"text","value":"Hello World"},"alignment":"center"}
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

To see your app, just go to [{:rel="noopener" target="_blank"}localhost:4000](http://localhost:4000/)

Great ! You've created an hello world app !
Let's see how to manage the views and data by adapting it to get the template counter app.

## The JSON views implementation

Now that we have a basic app we will implement our counter app elements starting with the JSON view.

If you want to get the app result look at the examples in [our client lib projects](https://github.com/search?q=topic%3Aclient+topic%3Alib+org%3Alenra-io&type=repositories):

### The counter JSON view

First we'll create the counter view.
Its purpose is to display the value of a counter and define a listener to increment it.

Let's define it in the new `src/views/counter.js` file:

{:data-file="src/views/counter.js"}

```javascript
/**
 * 
 * @param {*} _data 
 * @param {*} _props 
 * @returns {import("@lenra/app").JsonViewResponse}
 */
export default function (_data, _props) {
  const count = 0;
  return {
    value: count,
    onIncrement: {}
  };
}
```

To see it, we need to define the view in the manifest.

{:data-file="src/manifest.js"}

```javascript
/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/counter/global",
            view: View("counter")
        }
    ]
};
```

To reload (rebuild and restart) your app just press the `R` key while your terminal is in interactive mode.

Refresh the client and you will see your counter, but nothing happens when you click on the button.
Of course, we've defined the counter value with a constant value of 0.
Let's see how to dynamise it.

### The counter data

To dynamise our counter view we will need to manage a state to it.
To manage a state with Lenra, you will need to store it in the MongoDB database of your app.

To manage your app data you will need to use our API from a listener.
The JavaScript app-lib eases the data management by using classes.

#### The `Counter` class

We will create a new class file, `src/classes/Counter.js`, for the `Counter` class:

{:data-file="src/classes/Counter.js"}

```javascript
import { Data } from "@lenra/app";

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
    const counterColl = api.data.coll(Counter);
    // get the global counters
    let counters = await counterColl.find(Counter, { user: "global" })
    // if there is none, create one
    if (counters.length == 0) {
        await counterColl.createDoc(new Counter("global", 0));
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
All your container will stop and the data will be cleared.

You can now re-start your app with `lenra dev`.

Refresh your app in your browser to see the log that we've added in your app logs: `Global counter created`

Great, the data is created, but how to use it ?

#### Make the view dynamic

Now that we have a global counter data we will use it in our counter view.
To use data in a view you have to query it in your view declaration directly in the manifest.

{:data-file="src/manifest.js"}
```javascript
// add the Counter class import
import { Counter } from "./classes/Counter.js";

/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/counter/global",
            view: View("counter")
              // add the find query
              .find(Counter, {
                "user": "global"
              })
        }
    ]
};
```

We'll now adapt our counter view to use the response of the query.
We also will call an `increment` listener with the counter id in the `id` property:

{:data-file="src/views/counter.js"}

```javascript
import { Listener } from "@lenra/app";
import { Counter } from "../classes/Counter.js";

/**
 * 
 * @param {Counter[]} param0 
 * @param {*} _props 
 * @returns {import("@lenra/app").JsonViewResponse}
 */
export default function ([counter], _props) {
  return {
    value: counter.count,
    onIncrement: Listener("increment")
      .props({
        id: counter._id
      })
  };
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
 * @param {import("@lenra/app").props} props 
 * @param {import("@lenra/app").event} _event 
 * @param {import("@lenra/app").Api} api
 * @returns 
 */
export default async function (props, _event, api) {
    // We call the MongoDB updateMany method to increment the counter
    await api.data.coll(Counter).updateMany({ _id: props.id }, {
        $inc: {
            count: 1
        }
    });
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

Now we create a second route to have the two counters (user specific and global) and some layout:

{:data-file="src/manifest.js"}

```javascript
/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/counter/global",
            view: View("counter").find(Counter, {
                "user": "global"
            })
        },
        {
            path: "/counter/me",
            view: View("counter").find(Counter, {
                "user": "@me"
            })
        }
    ]
};
```

If you reload your app now, you'll have a problem since the current user you're making your tests with has already joined the app.
To resolve this, you can also implement the `onSessionStart` listener to check every time the user start the app that there is a counter for him or stop and restart your Lenra app to clear the data.

To explain how to test your like there is many users we will use a third solution: giving a user in the URL wth the `user` query param.

[{:rel="noopener" target="_blank"}localhost:4000?user=2](http://localhost:4000/?user=2)

If you want to try with more users just increment the `user` query param.
By opening many tabs you will see that when you increment the common counter it will automatically update the value for all the tabs at the same time.
It works the same way for the user specific counter if you open many tabs with the same value for the `user` query param.

## Lenra views implementation

Now that we have working JSON views we will create Lenra views that will do the same thing.

### The counter Lenra view

We will now create the Lenra view that will do the same thing as the JSON one, but with interface components.
The view will also need a `text` property to have a different text for each counter.

{:data-file="src/views/lenra/counter.js"}

```javascript
import { Flex, Text, Button } from "@lenra/app";

/**
 * 
 * @param {import("../../classes/Counter").Counter[]} param0 
 * @param {{text: string}} param1 
 * @returns 
 */
export default function ([counter], { text }) {
  return Flex([
    Text(`${text}: ${counter.count}`),
    Button("+")
      .onPressed("increment", {
        "id": counter._id
      })
  ])
    .spacing(16)
    .mainAxisAlignment("spaceEvenly")
    .crossAxisAlignment("center")
}
```

### Let's add some layout and autocompletion

Now that we have a working app we will make it a little prettier by adding some layout.
But let's use the indexer to target our views and listeners with autocompletion.

To index your app elements you just have to run the next command:

```bash
npm run index
```

Let's create our home view that will contain two counters:

{:data-file="src/views/lenra/home.js"}

```javascript
import { DataApi, Flex, View } from "@lenra/app";
import { Counter } from "../../classes/Counter.js";

export default function (_data, _props) {
    return Flex([
        View("lenra.counter")
            .find(Counter, {
                user: "@me"
            })
            .props({ text: "My personnal counter" }),
        View("lenra.counter")
            .find(Counter, {
                user: "global"
            })
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
import { Container, Flex, colors, padding, Image, Flexible, Text } from "@lenra/app";

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
import { Flex, View } from "@lenra/app";

export default function (_data, _props) {
  return Flex([
    View("lenra.menu"),
    View("lenra.home")
  ])
    .direction("vertical")
    .scroll(true)
    .spacing(4)
    .crossAxisAlignment("center")
}
```

We will now add the views to the manifest:

{:data-file="src/manifest.js"}

```javascript
/**
 * @type {import("@lenra/app").Manifest["lenra"]}
 */
export const lenra = {
    routes: [
        {
            path: "/",
            view: View("lenra.main")
        }
    ]
};
```

So the full manifest is:

{:data-file="src/manifest.js"}

```javascript
import { View } from "@lenra/app";
import { Counter } from "./classes/Counter.js";

/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/counter/global",
            view: View("counter").find(Counter, {
                "user": "global"
            })
        },
        {
            path: "/counter/me",
            view: View("counter").find(Counter, {
                "user": "@me"
            })
        }
    ]
};

/**
 * @type {import("@lenra/app").Manifest["lenra"]}
 */
export const lenra = {
    routes: [
        {
            path: "/",
            view: View("lenra.main")
        }
    ]
};
```

And that's it !
Your template app is finished.
