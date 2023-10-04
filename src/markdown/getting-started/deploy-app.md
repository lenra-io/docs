---
name: Deploy your app
---

When your application is ready to be shared with others you might find interest into deploying it to the online platform.

## Prerequisites

If you don't have a Lenra app yet, you can [create one](./create-project.md).

Before deploying your app, you need to push to a git repository.
This repo have to be accessible from the internet, so you can use GitHub, GitLab, BitBucket or any other git hosting service.
You can use a private repository, but you will need to follow [our dedicated guide](../guides/use-private-repository.md).

Make sure your app is working in production mode locally (using [the Lenra CLI](./install.md)) before deploying it by running the next command in your app directory:

```bash
# Build the app for production
lenra build --production
# Start the app previously built
lenra start
```

You can then test your app by opening [http://localhost:4000](http://localhost:4000) in your browser or starting your custom client.


## Deploy your app

Create an account on [{:rel="noopener" target="_blank"}dev.lenra.io](https://dev.lenra.io).

After successfully completing this step you will be redirected to the creation of your first project, just enter a name and the URL of the app git repository.
For private repositories, follow [our dedicated guide](../guides/use-private-repository.html).

Then you simply click `Publish my application` at the top right corner, your application will be sent to Lenra's servers and deployed to be accessible directly for the Lenra Store.

Once your application is fully deployed on our servers, it will be accessible by clicking the  `See my application` button.
This will open a new tab with the application running on the Lenra client (still in beta).


## Configure access

You can configure the access to your application by clicking the `Manage access` button in the settings menu.

You can choose to make your application public or private.
And for private applications, you can choose to give access to specific users.

The Lenra free plan does not let you give access to more than 2 more users than you.

## Configure external clients

The Lenra client is still in beta, you can configure your application to be accessible by other clients thanks to our OAuth2 auth system.
You can configure the OAuth2 clients in the `External clients` button in the settings menu.
