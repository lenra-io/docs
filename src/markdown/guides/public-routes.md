---
description: Give access to not authenticated users.
---

Do you want to give access to your app to not authenticated users?
In this guide we will explain how to create a public route and how to use it in a front-end app.

## Create a public route

To create a public route, you need to set the `roles` property of one of your manifest routes to `["guest"]` or `["guest", "user"]` if you want the same route to be accessible to authenticated and not authenticated users.

Here is an example of a public route:

```json
{
	"json": {
		"routes": [
			{
				"path": "/public",
				"view": "myPublicView",
				"roles": ["guest"]
			},
			{
				"path": "/all",
				"view": "myView",
				"roles": ["guest", "user"]
			},
			{
				"path": "/private",
				"view": "myPrivateView"
			}
		]
	}
}
```

## Use a public route in a front-end app

To use the [{:rel="noopener" target="_blank"} Lenra JavaScript client lib](https://github.com/lenra-io/client-lib-js) as an unauthenticated user, simply use the `openSocket()` method to connect to the Lenra server without a token, and then open the desired route :

```js
import { LenraApp } from '@lenra/client';

const app = new LenraApp({
	// Needed for not authenticated users
	appName: "Example Client",
	// Needed for authentication
	clientId: "XXX-XXX-XXX",
});

app.openSocket().then((socket) => {
	const route = app.route("/public", (data) => {
		// Handle data
	});
});
```

That's it! You can now use public routes in your front-end app.

You can authenticate users with the `authenticate()` method of the `LenraApp` class that will return the token to use as `openSocket(token)` method parameter.
Remember to close your existing socket if you don't need it anymore with the `close()` method:

```js
app.openSocket().then((socket) => {
	const route = app.route("/public", (data) => {
		// Handle data
	});

	document.getElementById("login").addEventListener("click", () => {
		socket.close();
		app.authenticate().then((token) => {
			app.openSocket(token).then((socket) => {
				const privateRoute = app.route("/private", (data) => {
					// Handle data
				});
			});
		});
	});
});
```
