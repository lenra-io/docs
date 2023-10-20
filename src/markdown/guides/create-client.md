---
name: Create an external client
---
The Lenra client is still in beta and it need some features (that we are working on) to give a good user experience for your app.
This makes it usable as is for PoC or back-end developers that don't want to have an advanced front, but it might seem limited for front-end developers.

That why we've created another kind of client for your Lenra apps thanks to the JSON views.

## JSON Views

The JSON Views work the same way as Lenra views, but instead of defining components you can define your own result structures.

You can define listeners anywhere in your structures by defining a JSON object corresponding to a Listener structure:

```json
{
  "_type": "listener",
  "name": "my listener name"
}
```

You can also add props in your listener structure to give properties to your listener execution.

Here is an example of JSON view for the counter template app:

```js
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

To expose a JSON view you need to define a corresponding JSON route.
See the [route documentation](../features/routes.html) to learn more about them.

## Create an external client

To create an external client, you first need to define what client technology you will use.
Look at [the client libs](https://github.com/search?q=topic%3Alenra+topic%3Aclient+topic%3Aclient+topic%3Alib&type=repositories) to ease Lenra integration in your existing client project.

Find [client example projects on GitHub](https://github.com/search?q=topic%3Alenra+topic%3Aclient+topic%3Aclient+topic%3Aexample&type=repositories) to start from an existing project.

## Configure an external client

Once your [application is deployed to our platform](../getting-started/deploy-app.html), you can configure your application to be accessible by your external clients thanks to our OAuth2 auth system.
You can configure the OAuth2 clients in the `External clients` button in the settings menu.

You should define a specific OAuth2 client for each platform for security reasons.

Define the client name to retrieve the configuration when you'll want to edit it.

Define the redirect URIs that can be used to redirect the user at the end of the OAuth2 flow.
The redirect URI will be defined at the begining of the OAuth2 flow by the client app.

Define the allowed origins for the OAuth2 flow.
The value is the list origins (protocol + hostname) that can call the OAuth2 endpoints.
Most of the time it should be the base URL of your redirect URIs.
