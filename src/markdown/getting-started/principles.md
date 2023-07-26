---
description: Understand how our app development framework works.
position: 0
---

Lenra is an open source framework to create your app using any language, and deploy it without any Ops scale, built on ethical values.


## Framework

Our framework is based on four parts: data, views, listeners, and users.


{:.framework.colored-blocks}
- {:.red.lenra-icon-database}

    ### Data
    Without data, there is no app. That's why our framework starts with data. We believe that data should be simple and easy to understand.
- {:.green.lenra-icon-grid}

    ### Views
    The views are what the user sees and interacts with. It should be clear and concise. It should be easy to use and navigate.
- {:.blue.lenra-icon-users}

    ### Users
    They are the ones who will use your apps and benefit from them. We believe that all apps should be designed with the user in mind.
- {:.yellow.lenra-icon-bell}

    ### Listeners
    Listeners are what make an app interactive. They listen for user input and then respond accordingly.
    

Lenra uses a simple but efficient realtime MVC pattern. This means that any [data](#data) changes will update the view in real time for every connected users.

{:.red.lenra-icon-database}
### Data

The data in Lenra is simply a **mongo database**.
In this database you will store **documents** that are basically **JSON objects**.
Those JSON objects will be stored in **collections**.
For example, create a `ingredients` collection that will store all the ingredients of your cooking app.
Then create a `recipes` collection to store your recipes…

You can also query into your documents using the [mongo query language](https://www.mongodb.com/docs/manual/tutorial/query-documents/).
For example, let’s say you want to get all the ingredients that are currently in your fridge.
Your query will look like that: 

```json
{
	"coll": "ingredients",
	"query": {
		"inFridge": true
	}
}
```

{:.green.lenra-icon-grid}
### Views

The views are simple functions with 2 arguments: the **data** query result, a property object (**props**).
This function will return a json tree composed by native components or other views.
If one of the two argument changes, the view is rebuilt.

You can find all of the existing components by [checking our documentation](/references/components-api/).

For example, the counter view (in the template app) uses the `props` to customize the printed message and the `data` to get the counter value.
When the **+** button is pressed, the `increment` listener will be called.

{:data-source-file="views/counter.js"}
```javascript
export default async function(data, counter) {
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

{:.blue.lenra-icon-users}
### Users

We have integrated the users management in our framework since the apps are made for them.
So we handle account management, authentication, authorization, and user data for you.

The users will have a single Lenra account that will be used for all the apps they use, but we a specific ID for each app.
This system make it simpler for you to handle user data and give the users the a protection over there personnals data.

To link a data to the current user, just use the `@me` string as the user ID in your data and queries, and it will be replaced by the unique user ID of the current user for your app.

{:.yellow.lenra-icon-bell}
### Listeners

The listeners are event based workflows and are the only way to change the data.
A listener is a function that is able to call the data API to get/create/update/delete a document.
This function is called when an action is performed by the user on the UI (button pressed, click, checkbox checked…) or by external events (CRON, WebHooks...). 

The listener takes 3 arguments: a property object (**props**), the **event** that triggered this listener and an **api** object that contains all the informations needed to call the API. 

To update the model, simply call the HTTP data API in your listener. For example, the increment listener in the node template simply increments the counter given in the props. Here, the event is irrelevant (button click).

{:data-source-file="listeners/increment.js"}
```javascript
import { Counter } from "../classes/Counter.js";

/**
 * 
 * @param {import("@lenra/app-server").props} props 
 * @param {import("@lenra/app-server").event} _event 
 * @param {import("@lenra/app-server").Api} api
 * @returns 
 */
export default async function(props, _event, api) {
    let counter = await api.data.getDoc(Counter, props.id);
    counter.count += 1;
    await api.data.updateDoc(counter);
    return {};
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

Look at our [{:target="_blank" rel="noopener" .lenra-icon-github }GitHub](https://github.com/lenra-io) for more informations about our tech stack.