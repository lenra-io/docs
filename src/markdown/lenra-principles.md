# Lenra Principles

# How does Lenra works ?

Lenra use a simple but efficient realtime MVC patten. This means that any changes to the Model will update the view in real time for every connected users. 

First, your widgets will take care of creating your UI according to your model. Then your listener will first change document(s) in your mongo instance that will trigger a new realtime widget re-render.

## The Widgets

The widgets are simple functions with 2 arguments : the **data**, a property object (**props**). If one of the two argument change, the widget is rebuild.

For example, the counter widget in the template app use the props to customise the printed message and the data to get the counter value.

```jsx
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
<figcaption align="left" style="margin-top: -13px; margin-bottom: 13px; color: gray; font-size: 0.9em;">widgets/counter.js</figcaption>


## The listeners

If we want to change the model, we must call a listener. Your listener is a function that is able to call the data API to get/create/update/delete a document. This function is called when an action is performed by the user on the UI (button pressed, click, checkbox checked…). 

The listener take 3 arguments : a property object (**props**), the **event** that triggered this listener and an **api** object that contains all the necessary the data API informations. 

To update the model simply call the HTTP data API in your listener. For example, the increment listener in the node template simply increment the counter given in the props. Here, the event is irrelevant (button click).

```jsx
const apiService = require("../services/api");

module.exports = async (props, event, api) => {

    let res = await apiService.getDoc(api, "counter", props.id);
    let counter = res.data
    counter.count += 1;
    return apiService.updateDoc(api, "counter", counter);
}
```
<figcaption align="left" style="margin-top: -13px; margin-bottom: 13px; color: gray; font-size: 0.9em;">listeners/increment.js</figcaption>


## The model

The model in Lenra is simply a **mongo database**. In this database you will store **documents** that are basically a **json object**. These json objects will be stored in **collections.** For example, create a `ingredients` collection that will store all the ingredients of your cooking app. Then create a `recipes` collection to store your recipes…

You can also query into your documents using the mongo query language. For example, let’s say you want to get all the ingredients that are currently in your fridge. Your query will look like that : 

```json
{
	"coll": "ingredients",
	"query": {
		"inFridge": true
	}
}
```
