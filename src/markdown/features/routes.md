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
    }
  }
]
```

By using the `:id` parameter, the route `/books/:id` will match any route. The value for `:id` can then be fetched from inside of the view using the context which is the third argument of the view's function.

# Navigating to a route

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
