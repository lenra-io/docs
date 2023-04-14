# Defining Routes

Routes are defined in the `lenra.yml` file under the `lenraRoutes` property. The `lenraRoutes` property is an array of objects, where each object represents a route. Each route object has two properties:

- `path` - Defines the URL path that corresponds to the route.
- `widget` - Defines the view that is associated with the route.

## lenra.yml example

```js
module.exports = async () => {
  return {
    views: {
      main: require('./views/main'),
      newPage: require('./views/newPage'),
    },
    listeners: {
      onEnvStart: require('./listeners/onEnvStart'),
      onSessionStart: require('./listeners/onSessionStart'),
      onUserFirstJoin: require('./listeners/onUserFirstJoin')
    },
    lenraRoutes: [
      {
        path: "/",
        widget: {
          type: "view",
          name: "main"
        }
      },
      {
        path: "/newPage",
        widget: {
          type: "view",
          name: "newPage"
        }
      }
    ]
  }
}
```

# Navigating to a route

You can navigate to any route that is defined in the `lenraRoutes` property in the `lenra.yml` file. To do that, you have to call the specific listener action `@lenra:navTo`. Here is an example of a button using this listener.

```json
{
    type: "button",
    text: "@lenra",
    onPressed: {
        action: "@lenra:navTo",
        props: { path: "/newPage" }
    }
}
```

# Websocket Routes Channels

The client communicates with the server via a WebSocket to get the list of routes and the corresponding UI for each route. The server listens on two channels:

- `"/routes"` - This channel is used to request the list of routes from the server. When a client sends a message to this channel, the server responds with an array of route objects.

- `"/route:*"` - This channel is used to request the UI for a specific route. The * character in the channel name is replaced with the path of the route. For example, to request the UI for the "/newPage" route, the client sends a message to the "/route/newPage" channel. When a client sends a message to this channel, the server responds with the JSON object that describes the UI for the corresponding view.

## Websocket examples

```js
// Receive routes from the "routes" channel
["2","2","routes","phx_join",{"mode":"lenra"}]
["2","2","routes","phx_reply",{"response":{"lenraRoutes":[{"path":"/","widget":{"name":"main","type":"view"}},{"path":"/newPage","widget":{"name":"newPage","type":"view"}}]},"status":"ok"}]


// Receive UI of newPage widget from "/route:/newPage" channel
["4","4","route:/newPage","phx_join",{"mode":"lenra"}]
["4","4","route:/newPage","phx_reply",{"response":{},"status":"ok"}]
["4",null,"route:/newPage","ui",{"root":{"onPressed":{"code":"a6m/iXb/1L+ZgPNXqP/GDImbKoRQE9HcgD1AuhK6XPE="},"text":"NEW PAGE","type":"button"}}]
```