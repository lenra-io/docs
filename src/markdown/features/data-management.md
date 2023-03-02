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

## View

Lenra also permit the use of Mongo find to adapt the view result to the requested data.
This behaviour also updates interface automatically when a data corresponding to the view query changes.

### Examples

The next example will call the `filteredUsers` view with ths users called `Thomas` as input data:

```json
{
    "type": "view",
    "name": "filteredUsers",
    "find": {
        "coll": "users",
        "query": {
            "name": "Thomas"
        }
    }
}
```

You can get only the name of the users by using this projection:

```json
{
    "type": "view",
    "name": "userList",
    "find": {
        "coll": "users",
        "projection": {"name": true}
    }
}
```

### Limitations

In order to manage realtime refresh of the view we had to implement the Mongo operators in our [query-parser project](https://github.com/lenra-io/query-parser).
Since it takes time to implement all the operators (and that we also have lot of work on Lenra) we only have implemented a short list of them.
We will implement the rest of them soon, but if you want to help you can look at [the list of operator task](https://github.com/lenra-io/query-parser/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+operator).

### Managed operators

<!-- Get the groups and description from Mongo doc: https://www.mongodb.com/docs/manual/reference/operator/query/ -->

#### Comparison

| Operator | Description |
|==========|=============|
| [{:target="_blank" rel="noopener"}$eq](https://www.mongodb.com/docs/manual/reference/operator/query/eq/)     | Matches values that are equal to a specified value. |
| [{:target="_blank" rel="noopener"}$ne](https://www.mongodb.com/docs/manual/reference/operator/query/ne/)     | Matches all values that are not equal to a specified value. |
| [{:target="_blank" rel="noopener"}$gt](https://www.mongodb.com/docs/manual/reference/operator/query/gt/)     | Matches all values that are not equal to a specified value. |
 |
| [{:target="_blank" rel="noopener"}$gte](https://www.mongodb.com/docs/manual/reference/operator/query/gte/)   | Matches values that are greater than or equal to a specified value. |
| [{:target="_blank" rel="noopener"}$lt](https://www.mongodb.com/docs/manual/reference/operator/query/lt/)     | Matches values that are less than a specified value. |
| [{:target="_blank" rel="noopener"}$lte](https://www.mongodb.com/docs/manual/reference/operator/query/lte/)   | Matches values that are less than or equal to a specified value. |
| [{:target="_blank" rel="noopener"}$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/)     | Matches any of the values specified in an array. | 
| [{:target="_blank" rel="noopener"}$nin](https://www.mongodb.com/docs/manual/reference/operator/query/nin/)   | Matches none of the values specified in an array. |

#### Logical

| Operator | Description |
|==========|=============|
| [{:target="_blank" rel="noopener"}$and](https://www.mongodb.com/docs/manual/reference/operator/query/and/)   | Joins query clauses with a logical `AND` returns all documents that match the conditions of both clauses. |
| [{:target="_blank" rel="noopener"}$or](https://www.mongodb.com/docs/manual/reference/operator/query/or/)     | Inverts the effect of a query expression and returns documents that do *not* match the query expression. |
| [{:target="_blank" rel="noopener"}$not](https://www.mongodb.com/docs/manual/reference/operator/query/not/)   | Joins query clauses with a logical `NOR` returns all documents that fail to match both clauses. |
| [{:target="_blank" rel="noopener"}$nor](https://www.mongodb.com/docs/manual/reference/operator/query/nor/)   | Joins query clauses with a logical `OR` returns all documents that match the conditions of either clause. |

#### Element

| Operator | Description |
|==========|=============|
| [{:target="_blank" rel="noopener"}$exists](https://www.mongodb.com/docs/manual/reference/operator/query/exists/) | Matches documents that have the specified field. |

#### Array

| Operator | Description |
|==========|=============|
| [{:target="_blank" rel="noopener"}$all](https://www.mongodb.com/docs/manual/reference/operator/query/all/)    | Matches arrays that contain all elements specified in the query. |
