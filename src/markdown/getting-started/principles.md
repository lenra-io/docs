---
description: Understand how our app development framework works.
position: 0
---

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

You can also query into your documents using the [{:rel="noopener" target="_blank"}mongo query language](https://www.mongodb.com/docs/manual/tutorial/query-documents/).


{:.green.lenra-icon-grid}
### Views

The views are simple functions with optional arguments:
- the **data** query result
- a property object (**props**)
- the **context** of the view

This function will return a JSON tree.
If one of the two argument changes, the view is rebuilt.

There is two kind of views in Lenra apps:
- the JSON views that are used by external clients.
    They let you define any kind of JSON structure as output.
    The JSON views are recommended for front-end developers.
- the Lenra views that are used by the Lenra client.
    Their output needs to be a [Lenra component](../references/components-api/).
    The Lenra views are recommended for back-end developers.


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
A listener is a function that is able to call the data API to get/create/update/delete documents.
They are called when an action is performed by the user on the UI (button pressed, click, checkbox checked…) or by external events (CRON, WebHooks...). 

A listener takes 3 arguments: a property object (**props**), the **event** that triggered this listener and an **api** object that contains all the informations needed to call the API. 

To update the model, simply call the [HTTP data API](../features/data-management.html) in your listener.
