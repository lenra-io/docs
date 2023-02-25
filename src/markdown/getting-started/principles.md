---
description: Understand how our app development framework works.
position: 0
---

## How does Lenra work ?

Lenra uses a simple but efficient realtime MVC pattern. This means that any changes to the Model will update the view in real time for every connected users.

{:.list}
- First, your views will take care of creating your UI according to your model.
- Then your listener will first change document(s) in your mongo instance.
- That will trigger a new realtime view re-render (back to #1).

## Views

The views are simple functions with 2 arguments: the **data**, a property object (**props**). This function will return a json tree composed by native components or other views. If one of the two argument changes, the view is rebuilt.

You can find all of the existing components by [checking our documentation](/references/components-api/).

For example, the counter view (in the template app) uses the `props` to customize the printed message and the `data` to get the counter value. When the **+** button is pressed, the `increment` listener will be called.

{:data-source-file="views/counter.js"}
```javascript
module.exports = (data, counter) => {

  return {
    "type": "flex",
    "spacing": 2,
    "mainAxisAlignment": "spaceEvenly",
    "crossAxisAlignment": "center",
    "children": [
      {
        "type": "text",
        "value": `${counter.text}: ${data[0].count}`
      },
      {
        "type": "button",
        "text": "+",
        "onPressed": {
          "action": "increment",
          "props": {
            "id": data[0]._id,
            "datastore": data[0].datastore
          }
        }
      }
    ]
  }
}
```

## Listeners

If we want to change the model, we must call a listener. Your listener is a function that is able to call the data API to get/create/update/delete a document. This function is called when an action is performed by the user on the UI (button pressed, click, checkbox checked…). 

The listener takes 3 arguments: a property object (**props**), the **event** that triggered this listener and an **api** object that contains all the informations needed to call the API. 

To update the model, simply call the HTTP data API in your listener. For example, the increment listener in the node template simply increments the counter given in the props. Here, the event is irrelevant (button click).

{:data-source-file="listeners/increment.js"}
```javascript
const apiService = require("../services/api");

module.exports = async (props, event, api) => {

    let res = await apiService.getDoc(api, "counter", props.id);
    let counter = res.data
    counter.count += 1;
    return apiService.updateDoc(api, "counter", counter);
}
```


## Data

The model in Lenra is simply a **mongo database**. In this database you will store **documents** that are basically a **JSON object**. These JSON objects will be stored in **collections**. For example, create a `ingredients` collection that will store all the ingredients of your cooking app. Then create a `recipes` collection to store your recipes…

You can also query into your documents using the [mongo query language](https://www.mongodb.com/docs/manual/tutorial/query-documents/). For example, let’s say you want to get all the ingredients that are currently in your fridge. Your query will look like that: 

```json
{
	"coll": "ingredients",
	"query": {
		"inFridge": true
	}
}
```

## The tech stack

In order to build that platform we had to create a custom application system based on open-source technologies.

{:style="width: 100%"}
![Lenra architecture](/img/architecture.svg)

If you want to know more about our tech stack, you can visit their website by clicking on the links below:

{:.list}
- {:target="_blank" rel="noopener"}[Flutter](https://flutter.dev/)
- {:target="_blank" rel="noopener"}[Phoenix](https://phoenixframework.org/)
- {:target="_blank" rel="noopener"}[PostgreSQL](https://www.postgresql.org/)
- {:target="_blank" rel="noopener"}[Mongodb](https://mongodb.com/)
- {:target="_blank" rel="noopener"}[OpenFaaS](https://www.openfaas.com/)
- {:target="_blank" rel="noopener"}[Kubernetes](https://kubernetes.io/)


If you've already used Flutter or Mongo, you will probably see a lot of the same principles while building your app with Lenra. You can use this knowledge !