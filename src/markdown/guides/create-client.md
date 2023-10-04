---
name: Create an external client
---

The Lenra client is still in beta and it need some features (that we are working on) to give a good user experience for your app.
This make it usable as is for PoC or back-end developers that don't want to have an advanced front, but for front-end developers it's limited.

That why we've created another kind of client for your Lenra apps thanks to the JSON views.

## JSON Views



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
