Crons on Lenra are a way to schedule tasks to be executed at specific times. A cron can be managed using the CRUD operations.

## Creating a cron that runs each minute

To create a cron on Lenra, make a POST request to the `/app/crons` endpoint with the following required parameters:

- `listener_name`: a string corresponding to the name of the listener on the application.
- `schedule`: a string corresponding to the cron 5 star format `* * * * *`.

The `schedule` parameter consists of five fields, each separated by a space, that represent minute, hour, day of the month, month, and day of the week. Here is the format:

```scss
* * * * *
- - - - -
| | | | |
| | | | +----- day of the week (0 - 6) (Sunday=0)
| | | +------- month (1 - 12)
| | +--------- day of the month (1 - 31)
| +----------- hour (0 - 23)
+------------- min (0 - 59)
```

Each field can take the following values:

- An asterisk (`*`) means "any value". For example, `* * * * *` would run the job every minute, every hour, every day of the month, every month, and every day of the week.

- A single value specifies a specific value for that field. For example, `0 * * * *` would run the job at the beginning of every hour, and `0 0 1 * *` would run the job at midnight on the first day of every month.

- A range of values specifies a range for that field. For example, `0 9-17 * * *` would run the job every minute between 9 AM and 5 PM.

- A list of values specifies a list of values for that field. For example, `0 0 1,15 * *` would run the job at midnight on the first and fifteenth days of every month.

- A step value specifies a value that the field must be evenly divisible by. For example, `*/15 * * * *` would run the job every 15 minutes, and `0 0 */2 * *` would run the job every other day.

You can also pass props to the request body for additional data that will be sent to the listener, for example:

```json
{
  "listener_name": "myListener",
  "schedule": "* * * * *",
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
  "schedule": "* * * * *",
  "props": {
    "userId": "1234"
  }
}
```

You will need to remember this `name` to properly call the `UPDATE` and `DELETE` endpoints that are under `/crons/:name`.
