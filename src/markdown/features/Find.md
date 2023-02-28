## Mongo find

Query system are based on the mongo one, we have two ways to query data on Lenra:

- [View](#View)
- [API](#API)

### View
<a name="View"></a>

In View you can request data in the view component using **find**, here all operator available:

- [Projection](#viewProjection)  

#### Projection
<a name="viewProjection"></a>

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

### API
<a name="API"></a>

to execute a find request througt the api you can make a request on:

```js
`${api.url}/app/colls/${coll}/docs/find`
```
> **api** the object giving in the third params of your listener  
> **coll** the name of the collection on which run the query  

All operator available:
- [Projection](#apiProjection)  


#### Projection
<a name="apiProjection"></a>

In the same way that in the view you can giving a projection map into the find request body, example:

We have in the collection *users*

```json
{
    "_id": "123456",
    "name": "John",
    "age": 20
}
```

We can send this body to have only user name in return

```json
{
    "query": {},
    "projection": {"name": true}
}
```