Lenra Data system is based on Mongo.

There is two ways to handle data in Lenra:
- in the listeners: you can use the [API](#api) to manage your data
- in the views: you can use the [View component](/references/components-api/components/view.html) to adapt your application interface


## API

To manage the data in your application, you can utilize our REST API.
To make a basic API call within Listeners, you can use the "api" object that is passed as the third parameter.
This object provides you with the server URL and your authentication token.

Set the authentication token in the header of your request:

```http
Authorization: Bearer ${api.token}
```

### CRUD

Create a document, give the content in the body

```js
- POST `${api.url}/app/colls/${coll}/docs`
```

Read a specific document
```js
- GET `${api.url}/app/colls/${coll}/docs/${id}`
```

Update a document, give the changes in the body
```js
- PUT `${api.url}/app/colls/${coll}/docs/${doc._id}`
```

Delete a document
```js
- DELETE `${api.url}/app/colls/${coll}/docs/${doc._id}`
```

### Transactions

To handle multiple operations in one request, you can use the [{:rel="noopener" target="_blank"}Mongo transactions](https://www.mongodb.com/docs/manual/core/transactions/).

You can start a transaction by creating it via the API:

```js
- POST `${api.url}/app/colls/${coll}/transaction`
```

This will return a transaction token.

Then you can add operations ([CRUD](#crud) and/or [advanced Mongo functions](#advanced-mongo-functions)) to the transaction by using the transaction token instead of the API token in the header of your request:

```http
Authorization: Bearer ${transactionToken}
```

When you are done, you can commit the transaction to execute all the operations:

```js
- POST `${api.url}/app/colls/${coll}/transaction/commit`
```

Or you can abort the transaction to cancel all the operations:

```js
- POST `${api.url}/app/colls/${coll}/transaction/abort`
```

You also need to use the transaction token in the header of those final requests.


### Advanced Mongo functions

- [find](#find)
- [updateMany](#updatemany)

#### find

The [{:rel="noopener" target="_blank"}MongoDB find function](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/) can find many documents in a collection filtered by the query filter.

Run find request, give find params in body like:
  - query: the query filter
  - projection: the projection map more details [here](#apiProjection)

```js
- POST `${api.url}/app/colls/${coll}/docs/find` 
```

The projection allows you to filter the keys in the return object, by giving a projection map, all keys set to *true* will be returned, the default values are *false*, example:

We have in the *users* collection 

```json
{
    "_id": "123456",
    "name": "John",
    "age": 20
}
```

#### updateMany

The [{:rel="noopener" target="_blank"}MongoDB updateMany function](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/) udates all documents that match the specified filter for a collection. 
```js
- POST `${api.url}/app/colls/${coll}/updateMany`
```

{:.list}
- `filter` select all document to update (like find query, see [{:rel="noopener" target="_blank"}query selectors](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors))  
- `update` the modifications to apply see [{:rel="noopener" target="_blank"}update operators](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators)

## View

Lenra also allows the use of Mongo find to customize the view's results according to the requested data.
Additionally, this behavior automatically updates the interface when a data point corresponding to the view query is changed.
### Examples

The next example will call the `filteredUsers` view with the user called `Thomas` as input data:

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

You can get only the names of the users by using this projection:

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

In order to manage realtime refresh of the view we had to implement the Mongo operators in our [{:rel="noopener" target="_blank"}query-parser project](https://github.com/lenra-io/query-parser).
Since it takes time to implement all the operators (and that we also have lot of work on Lenra) we only have implemented a short list of them.
We will implement the rest of them soon, but if you want to help you can look at [{:rel="noopener" target="_blank"}the list of operator task](https://github.com/lenra-io/query-parser/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+operator).

### Managed operators

<!-- Get the groups and description from Mongo doc: https://www.mongodb.com/docs/manual/reference/operator/query/ -->

#### Comparison

| Operator | Description |
|==========|=============|
| [{:rel="noopener" target="_blank"}$eq](https://www.mongodb.com/docs/manual/reference/operator/query/eq/)     | Matches values that are equal to a specified value. |
| [{:rel="noopener" target="_blank"}$ne](https://www.mongodb.com/docs/manual/reference/operator/query/ne/)     | Matches all values that are not equal to a specified value. |
| [{:rel="noopener" target="_blank"}$gt](https://www.mongodb.com/docs/manual/reference/operator/query/gt/)     | Matches all values that are not equal to a specified value. |
 |
| [{:rel="noopener" target="_blank"}$gte](https://www.mongodb.com/docs/manual/reference/operator/query/gte/)   | Matches values that are greater than or equal to a specified value. |
| [{:rel="noopener" target="_blank"}$lt](https://www.mongodb.com/docs/manual/reference/operator/query/lt/)     | Matches values that are less than a specified value. |
| [{:rel="noopener" target="_blank"}$lte](https://www.mongodb.com/docs/manual/reference/operator/query/lte/)   | Matches values that are less than or equal to a specified value. |
| [{:rel="noopener" target="_blank"}$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/)     | Matches any of the values specified in an array. | 
| [{:rel="noopener" target="_blank"}$nin](https://www.mongodb.com/docs/manual/reference/operator/query/nin/)   | Matches none of the values specified in an array. |

#### Logical

| Operator | Description |
|==========|=============|
| [{:rel="noopener" target="_blank"}$and](https://www.mongodb.com/docs/manual/reference/operator/query/and/)   | Joins query clauses with a logical `AND` returns all documents that match the conditions of both clauses. |
| [{:rel="noopener" target="_blank"}$or](https://www.mongodb.com/docs/manual/reference/operator/query/or/)     | Inverts the effect of a query expression and returns documents that do *not* match the query expression. |
| [{:rel="noopener" target="_blank"}$not](https://www.mongodb.com/docs/manual/reference/operator/query/not/)   | Joins query clauses with a logical `NOR` returns all documents that fail to match both clauses. |
| [{:rel="noopener" target="_blank"}$nor](https://www.mongodb.com/docs/manual/reference/operator/query/nor/)   | Joins query clauses with a logical `OR` returns all documents that match the conditions of either clause. |

#### Element

| Operator | Description |
|==========|=============|
| [{:rel="noopener" target="_blank"}$exists](https://www.mongodb.com/docs/manual/reference/operator/query/exists/) | Matches documents that have the specified field. |
| [{:rel="noopener" target="_blank"}$type](https://www.mongodb.com/docs/manual/reference/operator/query/type/)     | Selects documents if a field is of the specified type. |

#### Array

| Operator | Description |
|==========|=============|
| [{:rel="noopener" target="_blank"}$all](https://www.mongodb.com/docs/manual/reference/operator/query/all/)    | Matches arrays that contain all elements specified in the query. |
