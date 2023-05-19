Webhooks are an important feature of Lenra that allow your application to receive real-time updates from external services. With webhooks, you can automate your application workflows and keep your data in sync with external services.

## Introduction

A webhook is a way for an external service to notify your application of an event. When an event occurs, the external service sends a request to a URL that you specify, which triggers an action in your application.

In Lenra, you can create a webhook by calling the POST `/app/webhooks` endpoint with the `action` and `props` parameters. The `action` parameter is a string that corresponds to the name of the listener on the Lenra application.

The `props` parameter is the data that you want to assign to the webhook when creating it, this will be passed to the corresponding listener as `props`. For example, if you want the webhook to be linked to a user, you might want to add the user id in the props `{props: {userId: 1}}`.

Once you create a webhook, you can trigger it by calling the POST `/apps/:app_uuid/webhooks/:webhook_uuid` endpoint with your application UUID and webhook UUID. The webhook can be triggered with some data, which are received in the event variable on the corresponding listener of the application.

## Creating a Webhook

To create a webhook on Lenra, follow these steps:

1. Call the POST `/app/webhooks` endpoint with the `action` and `props` parameters. For example:

```bash
POST /app/webhooks
{
  "action": "exampleListener",
  "props": {
    "userId": 1
  }
}
```

2. The server will respond with the webhook UUID. You should store this UUID for later use.

```json
{
  "uuid": "c14990db-96a1-44c6-b13a-8ab12db96f61",
  "action": "exampleListener",
  "props": {
    "userId": 1
  },
  "environment_id": 1,
  "user_id": null
}
```

## Triggering a Webhook

To trigger a webhook on Lenra, follow these steps:

1. Call the POST `/apps/:app_uuid/webhooks/:webhook_uuid` endpoint with the webhook UUID. For example:

```bash
POST /apps/14361375-54d4-4ddb-8d2d-0dd212e13cd1/webhooks/c14990db-96a1-44c6-b13a-8ab12db96f61
```

2. Include any data that you want to send with the webhook in the request body. For example:

```json
{
  "triggerData": "someData"
}
```

3. The webhook will be triggered, and the data will be received in the `event` variable on the application.
