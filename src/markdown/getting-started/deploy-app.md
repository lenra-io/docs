---
name: Deploy your app
---
When your application is ready to be shared with others you might find interest into deploying it to the online platform.

## Prerequisites

If you don't have a Lenra app yet, you can [create one](./create-project.html).

Before deploying your app, you need to push to a git repository.
This repo have to be accessible from the internet, so you can use GitHub, GitLab, BitBucket or any other git hosting service.
You can use a private repository, but you will need to follow [our dedicated guide](../guides/use-private-repository.html).

Make sure your app is working in production mode locally (using [the Lenra CLI](./install.html)) before deploying it by running the next command in your app directory:

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

Once your application is fully deployed on our servers, it will be accessible by clicking the `See my application` button.
This will open a new tab with the application running on the Lenra client (still in beta).

You can configure an external client to have advanced customisation on the UI of your app.
Look at [the corresponding guide](../guides/create-client.html) to configure your clients.

You also can configure the access to your application by reading [the corresponding guide](../guides/manage-access.html).
