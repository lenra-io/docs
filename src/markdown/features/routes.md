Routes are defined in the app manifest under the `routes` property of the `json` and `lenra` providers. The `routes` property is an array of objects, where each object represents a route. Each route object has two properties:

- `path` - Defines the URL path that corresponds to the route.
- `view` - Defines the view that is associated with the route.
- `roles` - Defines the roles that are allowed to access the route. The default value is `["user"]`. [Read more about roles](#routeroles)

## Manifest example

```json
{
  "lenra": {
    "routes": [
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
The value for `:id` can be used in the view query as you can see in the example above by prefixing the variable name by `@route.`.
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

## Navigating to a Lenra route

You can navigate to any route that is defined in the `lenra.routes` property in the app manifest. To do that, you have to call the specific listener action `@lenra:navTo`. Here is an example of a button using this listener.

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

## Route roles

There are for now only two roles managed by Lenra:
- `guest`: This role is used for users that are not logged in.
- `user`: This role is used for users that are logged in.

The route roles are defined in the app manifest under the `roles` property of the route object.
The default value is `["user"]` to only allow the authenticated users.
If you want to allow both logged in and not logged in users to access the route, you can set the `roles` property to `["guest", "user"]`.

```json
{
  "lenra": {
    "routes": [
      {
        "path": "/",
        "view": {
          "type": "view",
          "name": "main"
        },
        "roles": ["guest", "user"]
      }
    ]
  }
}
```

If you want to make your app accessible to guest users you'll have to [make it public](../guides/manage-access.html#publicaccess).
