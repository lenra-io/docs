Lenra Data system is based on Mongo.
Using our API, you can access and manage this data and utilize the [View component](/references/components-api/components/view.html) to adapt your application interface.

## API

To manage the data in your application, you can utilize our REST API.
To make a basic API call within Listeners, you can use the "api" object that is passed as the third parameter. This object provides you with the server URL and your authentication token.

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

We have in the *users* collection 

```json
{
    "_id": "123456",
    "name": "John",
    "age": 20
}
```

#### Update Many

The [MongoDB updateMany function](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/) udates all documents that match the specified filter for a collection. 
```js
- PUT `${api.url}/app/colls/${coll}/docs/update}`
```

- `filter` select all document to update (like find query, see [query selectors](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors))  
- `update` the modifications to apply see [update operators](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators)

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
