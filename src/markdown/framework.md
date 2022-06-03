The Lenra's framework is made on three parts: [the data](#data), [the widgets](#widgets) and [the listeners](#listeners).
<!-- TODO: schema -->

## Data

The data is the central part of the framework.
It let you store and request your app data.

The data are stored in datastores (yes it's obvious).
The datastores let you group sets of JSON data elements.

We offer you a built in `_users` datastore to link data with user accounts.

The data can reference other ones with the `_refs` property.
You also can manage the data that reference one with the `_refBy` property.

Use our [app data API](data-api/) to manage your datastores and data within your [listeners](#listeners) and use the [query API](query-api/) to make your [widgets](#widgets) dynamic.

## Widgets

The widget system let you manage the user interface of your app.
Check our [components API](components-api/) to find the components to build your widgets.

The widgets can be based on [the data](#data) by passing a [query](query-api/query.html) in the `query` attribute of the widget.

Some components, like [buttons](components-api/components/button.html), can dispatch events to run [listeners](#listeners).

## Listeners

The listeners are the core of your app.
It's with them that you will manage your [data](#data) or call external services.
