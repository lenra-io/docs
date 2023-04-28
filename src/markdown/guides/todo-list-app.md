---
description: Look at this guide to create a todo list app.
---

Now that you know the basics of a Lenra app, we can create our first app : a basic TODO List.

> Note : To follow this guide, you must have basic knowledge about javascript, Mongo query language and API call (using axios).

First of all, we want to organize our model (database). 

We will have only one collection : the **task** collection that will store all of our tasks. 

A task item will contain 4 properties : 

- The ID of the document. This id is auto-generated, you don’t have to care about this.
- The description of the task to be done
- A boolean to save the done status
- A reference to the current user to help us to only get the user todo.

Our document will look like that : 

{:data-document="A simple Mongo document"}
```json
{
	"_id": "ObjectId(634d692fcbd9f6704818309c)"
	"description": "Code my first app with Lenra",
	"done": false,
	"user": "a ref to the user"
}
```

## Create a new task

Now that we know what a task looks like, we want to create a new view to let the user create tasks. To do that, we will create a new file in the views directory : `addTaskForm.js`

Before anything else, we will register this view to our application. This will link this function to the `addTaskForm` ****action. To do this, go to the `index.js` file and add a line in the `views` object.

{:data-document="index.js"}
```javascript
module.exports = async () => {
  return {
    views: {
      main: require('./views/main'),
      ...
      addTaskForm: require('./views/addTaskForm'),
    },
    listeners: {
      ...
    },
    rootview: 'main'
  }
}
```

In the `addTaskForm.js` view, we create a new function (and export it). In this function, we will first add a **[form component](https://docs.lenra.io/components-api/components/form.html).**

{:data-document="views/addTaskForm.js"}
```javascript
module.exports = (data, props) => {
  return {
    type: "form",
		onSubmit: {
      action: "submitTask"
    },
    child: {...}
  }
}
```

In this view, we define the `onSubmit` listener. This tells the UI to submit the `submitTask` action when the form is submitted.

Then we will declare the inputs in our form.

{:data-document="views/addTaskForm.js"}
```javascript
module.exports = (data, props) => {
  return {
    type: "form",
		onSubmit: {
      action: "submitTask"
    },
    child: [
		// 1 - Flex component
		{
      type: "flex",
      crossAxisAlignment: "center",
			spacing: 2,
      children: [
			  // 2 - label
				{
	        type: "text",
	        value: "Your task : "
		    },
				// 3 - The textfield to type the description
		    {
	        type: "flexible",
	        child: {
	          type: "textfield",
	          value: "",
	          name: "description"
	        }
		    },
				// 4 - The button to submit the form
				{
	        type: "button",
	        text: "Add",
	        submit: true,
		    }
			]
    }
  }
}
```

Let's see what happens here : 

### 1 : The [Flex component](https://docs.lenra.io/components-api/components/flex.html)

The form allows only one child. The reason is simple, it does not infer how you want to place your inputs in the form. That is why we add a Flex component that describes how the children will be placed in the UI. 

By default, the flex is horizontal. We add the `crossAxisAlignment: "center"` to vertically center the children and a `spacing: 2` to add some spaces between the children. 

### 2 : The label

This one simply adds a label before the textfield. That’s it !

### 3 : Textfield

This is a two in one. 

The [textfield component](https://docs.lenra.io/components-api/components/textfield.html) simply adds a textfield with a default value to empty (`value: “”`). The `name: “description”` connects this textfield first form up in the component tree. This way, when the form will be submitted, the event will contain a `description` field that contains the value of the textfield : 

{:data-document="The event object"}
```json
{
	"value": {
		"description": "valueOfTheTextfield"
	}
}
```

Then we have the [flexible component](https://docs.lenra.io/components-api/components/flexible.html). that allows the textfield to take all the remaining space in the flex above. As simple as that !

### 4 : The [submit button](https://docs.lenra.io/components-api/components/button.html)

This component is a simple button in which we add the `submit: true` property. This connects the form to this button. This way, when the button is pressed, the form will be automatically submitted (the `onSubmit` listener will be called).

### Call the form

Now that our form is ready, we just have to call it in our `main.js` component.

{:data-document="views/main.js"}
```javascript
module.exports = (data, props) => {
    return {
        type: "flex",
        direction: "vertical",
        crossAxisAlignment: "center",
        children: [
            {
                type: "text",
                value: "Lenra Todo List",
                style: {
                    fontWeight: "w800",
                    fontSize: 22
                }
            },
            {
                type: "view",
                name: "addTaskForm",
            }
        ]
    }
}
```


Now you can start your app in your terminal using 

```bash
lenra dev
```

Then open your browser at [http://localhost:4000](http://localhost:4000/)

Your app should look like that.
<p align="center">
    <img src="/img/basic_todo_list.png" width="500"/>
</p>

You should be able to type some text in the textfield. But for now the “add” button does nothing. Let's change that !

## Create the submitTask listener

We will now create the listener that will react to the “add” button pressed.

Remember the `action: "submitTask"` property in the form `onSubmit` listener ? That’s the name of our listener. So create a `submitTask.js` file in the **listeners** directory and add this code to it : 

{:data-document="listeners/submitTask.js"}
```javascript
// 1 - import the api service
const apiService = require("./api")

// 2 : create the function with "props", "event" and "api" arguments
module.exports = async (props, event, api) => {
		// 3 - Call the service to create a new task document.
    return apiService.createDoc(api, "tasks", {
        description: event.value.description,
        done: false,
        user: "@me"
    });
}
```


### 1 : Import the API service

This API service already exists in your base template by default. It simply defines a bunch of useful functions to easily call the data API. In this listener, we will use the “createDoc” function. You can check the content of this apiService.

### 2 : Create the function

A listener function takes 3 parameters : `props`, `event` and `api`. 

- The props will be ignored here.
- The event contains the data from all the form inputs (our `description`).
- The `api` contains the url and token useful to call the Data API. Don’t bother too much with this.

In this function body we can call our Data API to create our new task. 

Keep in mind that the listener must execute relatively fast in order to avoid long loader. (less than a second ideally). 

### 3 : Create our task

This is where the magic starts. The `apiService.createDoc` function will create a new document in the `tasks` collection. 

Remember our database model. The `user` field should contain the current user ID to be able to filter the task that belongs to the user. To do this, Lenra offers a shortcut to access contextual data. In our example `@me` is a reference to the current user ID and will be replaced automatically.

When the document is added, the UI will be rebuilt in order to instantly display the updated interface to the user.

Remember to register this listener to the `index.js` manifest.

{:data-document="index.js"}
```javascript
module.exports = async () => {
  return {
    ...
    listeners: {
			...
      submitTask: require('./listeners/submitTask'),
    },
    ...
  }
}
```

You can restart the app, run `lenra dev` again and you should be able to create a new task now !

But wait… The task are still not visible yet.

## List the user tasks

Now that we can add new tasks in our database, let's list them in the interface.

To do this, create a new `taskList.js` view and **register** it to the manifest `index.js`.

{:data-document="views/taskList.js"}
```javascript
module.exports = (data, props) => {
		
    return {
        type: "flexible",
        child: {
            type: "flex",
            direction: "vertical",
            scroll: true,
            children: taskList(data),
        }
    }
}

function taskList(tasks) {
    if (tasks == undefined || tasks.length <= 0) {
        return [{
            type: "text",
            value: "No tasks"
        }]
    }

    return tasks.map(task => {
        return {
            type: "view",
            name: "taskCard",
            props: {
                task: task
            }
        }
    })
}
```

Nothing too crazy here. We simply loop through the tasks list and call the `taskCard` view with the task in the properties. If there is no task in the data, simply print a message.

I’m sure you will be able to create the `taskCard` view by yourself ! If you have some trouble, check the [example in our github project](https://github.com/lenra-io/app-todo/blob/main/views/taskCard.js). (Don’t forget to **register** the `taskCard` too !)

Now we want to call our `taskList` with some **data** in it. To do this, go to the `main.js` view.

{:data-document="views/main.js"}
```javascript
module.exports = (data, props) => {
    return {
        type: "flex",
        direction: "vertical",
        crossAxisAlignment: "center",
        children: [
            {
                type: "text",
                value: "Lenra Todo List",
                style: {
                    fontWeight: "w800",
                    fontSize: 22
                }
            },
            // Call the taskList view with some data.
            {
                type: "view",
                name: "taskList",
                coll: "tasks",
                query: {
                    "user": "@me"
                }
            },
            {
                type: "view",
                name: "addTaskForm",
            }
        ]
    }
}
```

As you can see, we use the same component that we used to call the `addTaskForm` view. The only difference is the `coll` and `query` properties. 

The `coll` property defines the **collection** where we want to run the query. 

Then the `query` is a [simple mongo query](https://www.mongodb.com/docs/manual/tutorial/query-documents/) with the Lenra specificity : the `@me` to reference the current user. It is the same trick we used to create our task before. This query will filter the `tasks` collection to give us only the task associated with the current user. The result of this query is the `data` argument in our view function.

And we’re done ! Restart the Lenra CLI (`lenra dev`). The task list should now be visible ! 

## Add some features

We now have a simple list. But a todo list is more than just a list ! 

With your new knowledge, you should be able to create the next features.

### Delete a task

Add a button to delete the task next to it. When the user clicks this button, remove the task from the database.

You will need : 

- Update the `TaskCard` to add the delete [button](https://docs.lenra.io/components-api/components/button.html)
- Add a new listener to delete the task using the `api.deleteDoc()` function

### Toggle the tasks

When the user clicks on a task, toggle the`done` boolean. Then in the `TaskCard`, depending of this boolean, cross the description of the task.

You will need : 

- Update the `TaskCard` to add an [Actionable component](https://docs.lenra.io/components-api/components/actionable.html)
- Add a new listener to toggle the task using the `api.updateDoc()` function.
- Add a [textStyle](https://docs.lenra.io/components-api/defs/textStyle.html) property to the text description component.

## Troubleshooting

### Can I have some help anywhere ?

If you need help, you can check our [todo app github repo](https://github.com/lenra-io/app-todo) where all the above feature are implemented.

You also can ask questions using the [Help wanted category of our github discussion tab](https://github.com/lenra-io/Lenra/discussions/categories/help-wanted).

### I have created my listener/view but it says that this listener/view does not exists.

Be sure to register your listener/view in the `index.js` first ! This tells your javascript server to call your function when the listener action/view name is called.