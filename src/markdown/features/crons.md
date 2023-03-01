Crons on Lenra are a way to schedule tasks to be executed at specific times. A cron can be created using the CRUD operations available on the following endpoints:

- [Create](#create) (`POST /app/crons`)
- [Read](#read) (`GET /app/crons`)
- [Update](#update) (`PUT /app/crons/:name`)
- [Delete](#delete) (`DELETE /app/crons/:name`)

## Create

<a name="create"></a>

To create a cron on Lenra, make a POST request to the `/app/crons` endpoint with the following required parameters:

- `listener_name`: a string corresponding to the name of the listener on the application.
- `schedule`: a string corresponding to the cron 5 star format `* * * * *`.

You can also pass props to the request body for additional data that will be sent to the listener, for example:

```json
{
  "listener_name": "myListener",
  "schedule": "0 0 * * *",
  "props": {
    "userId": "1234"
  }
}
```

The response will contain the created cron with the additional generated name parameter:

```json
{
  "name": "5c18337c4de4a4a60ce4a6ee",
  "listener_name": "myListener",
  "schedule": "0 0 * * *",
  "props": {
    "userId": "1234"
  }
}
```

## Read

<a name="read"></a>

To read all the crons on Lenra, make a GET request to the `/app/crons` endpoint. The response will contain an array of all the existing crons.

## Update

<a name="update"></a>

To update a cron on Lenra, make a PUT request to the `/crons/:name` endpoint with the name parameter corresponding to the name of the cron to update. You can also pass the `listener_name`, `schedule`, and `props` parameters to update.

```json
{
  "listener_name": "myUpdatedListener",
  "schedule": "0 12 * * *",
  "props": {
    "userId": "5678"
  }
}
```

The response will contain the updated cron.

## Delete

<a name="delete"></a>

To delete a cron on Lenra, make a DELETE request to the `/crons/:name` endpoint with the name parameter corresponding to the name of the cron to delete. The response will contain the deleted cron.