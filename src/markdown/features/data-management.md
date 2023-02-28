Lenra Data system is based on Mongo.
We provide API to manage these data and you can access them in to adapt your app interface by using the [View component](/references/components-api/components/view.html).

## API

In order to manage the data in your app, you can call our REST API.
To handle the basic call to our API in Listeners you can used api object passed in third parameter, that provide you the server url and your token.

### CRUD

Create a document, give the content in body

```js
- POST `${api.url}/app/colls/${coll}/docs`
```

Read a specific document
```js
- GET `${api.url}/app/colls/${coll}/docs/${id}`
```

Update a document, give the change in body
```js
- PUT `${api.url}/app/colls/${coll}/docs/${doc._id}`
```

Delete a document
```js
- DELETE `${api.url}/app/colls/${coll}/docs/${doc._id}`
```

### Advanced Mongo functions


#### find

The [MongoDB find function](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/) can find many documents in a collection filtered by the query filter.

Run find request, give find params in body like:
  - query: the query filter
  - projection: the projection map more details [here](#apiProjection)

```js
- POST `${api.url}/app/colls/${coll}/docs/find` 
```

The projection allows you to filter the keys in the return object, by giving a projection map, all keys set to *true* will be returned, the default values are *false*, example:

We have in the collection *users*

```json
{
    "_id": "123456",
    "name": "John",
    "age": 20
}
```

You can get only the name of user with using this projection

```json
{
    "type": "view",
    "name": "myUser",
    "find": {
        "coll": "users",
        "query": {},
        "projection": {"name": true}
    }
}
```

## View

Lenra also permit the use of Mongo find to adapt the view result to the requested data.
This behaviour also updates interface automatically when a data corresponding to the view query changes.

