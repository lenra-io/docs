Routes are defined in the app manifest under the `lenraRoutes` property. The `lenraRoutes` property is an array of objects, where each object represents a route. Each route object has two properties:

- `path` - Defines the URL path that corresponds to the route.
- `view` - Defines the view that is associated with the route.

## Manifest example

```json
{
  "lenraRoutes": [
    {
      "path": "/",
      "view": {
        "type": "view",
        "name": "main"
      }
    },
    {
      "path": "/newPage",
      "view": {
        "type": "view",
        "name": "newPage"
      }
    }
  ]
}
```

You can utilize path parameters for your routes. For instance, you can use these routes:

```json
[
  {
    "path": "/",
    "view": {
      "type": "view",
      "name": "main"
    }
  },
  {
    "path": "/books/:id",
    "view": {
      "type": "view",
      "name": "bookPage",
      "find": {
        "type": "book",
        "query": {
          "id": "@route.id"
        }
      }
    }
  }
]
```

By using the `:id` parameter, the route `/books/:id` will match any route.
The value for `:id` can be used in the view query like in the example above by prefixing the variable name by `@route.`.
The `:id` parameter can also be fetched from inside of the view by doing as follows.

- You have to specify to the view that you want to use context values. (In this example let's consider that the view is under the path /myView/:id)

```json
{
    "type": "view",
    "name": "myView",
    "context": {
        "me": true,
        "pathParams": true,
    }
}
```

- Then you can add the context parameter to your view function.

```javascript
export default function (data, props, context) {
  return {
      type: "text",
      value: JSON.stringify(context), // This will be equal to {"me":"8bf756dd-0028-4bbd-b439-083add59ba54","pathParams":{"id":1}}
  }
```

## Navigating to a route

You can navigate to any route that is defined in the `lenraRoutes` property in the app manifest. To do that, you have to call the specific listener action `@lenra:navTo`. Here is an example of a button using this listener.

```json
{
    "type": "button",
    "text": "@lenra",
    "onPressed": {
        "action": "@lenra:navTo",
        "props": { "path": "/newPage" }
    }
}
```
