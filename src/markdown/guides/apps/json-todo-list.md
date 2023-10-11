---
name: Todo list with JSON views
description: Look at this guide to create a todo list app with JSON views.
---

In this guide I'll show you how to add Lenra to an existing app.
We'll use the [Todo-React](https://github.com/mdn/todo-react) app from MDN as an example.

Download the code and start tweak it following the guide.

## Initialize Lenra app

Add Lenra client lib to your project and initialize Lenra app

```bash
# Add the client lib
npm i @lenra/client
# Initialize the lenra app
lenra new -p app-lenra js
```

That will add the `@lenra/client` lib to your project and create the `app-lenra` folder that contain the backend lenra app.
You can move the `lenra.yml` to the root of your repo and add the key `path` at the root of the file.

{:data-file="lenra.yml"}

```yml
path: app-lenra
generator:
  dofigen:
		[...]
```

## Create the Lenra client elements

Create the Lenra app object and initialize it in the `index.js` file

{:data-file="src/index.js"}

```js
import { LenraApp } from '@lenra/client';

const lenraApp = new LenraApp({
  clientId: "XXX-XXX-XXX",
});
```

Create a react component that will show a button to login to Lenra that take as params the callback function `onClick` that will be called when the button is clicked. Which will handle the login to Lenra.

{:data-file="src/components/LoginButton.js"}

```js
import React from "react";

function LoginButton(props) {
  return (
			<div style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			}} >
				<button onClick={props.onClick} style={{
					border: "1px solid black",
					padding: "5px",
					margin: "10px 0px"
				}}>
					Login
				</button>
			</div >
  );
}

export default LoginButton;
```

In order to make the app code more readable, I'll move the `App.js` file content into a new `List.js` file (be careful to update the imports. So the `App.js` will be the main component that will handle the initialization of the lenra app and `List.js` will just contain the view that list todos.

You can also remove the `className` field of the returned `<div>`  of the `List.js`:

{:data-file="src/List.js"}

```js
	return (
		<div>
		 ...
		</div>
	);
```

The new content of the `App.js` file that will handle the initialization of the lenra app look like this:

{:data-file="src/App.js"}

```js
import React, { useState } from "react";

import LoginButton from './components/LoginButton'
import List from './List'

const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

/**
 * @param {{ app: LenraApp }} props
 */
function App({ app }) {
	/**
	 * @type {[LenraSocket, (value: LenraSocket) => void]}
	 */
	const [socket, setSocket] = useState(null);

	return (
    <div className="todoapp stack-large">
			{socket ? (
                <List tasks={DATA}/>
			) : (
					<LoginButton onClick={() => {
						app.connect().then((value) => {
							setSocket(value);
						});
					}}
				/>
			)}
		</div >
	);
}

export default App;
```

We can now adapt the `index.js` file to use the `App` component.

{:data-file="src/index.js"}

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { LenraApp } from '@lenra/client';
import App from "./App";
import "./index.css";

if (window.location.pathname === "/redirect.html") {
  window.opener.postMessage(window.location.href, `${window.location.protocol}//${window.location.host}`);
}
else {
  const lenraApp = new LenraApp({
    clientId: "XXX-XXX-XXX",
  });

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App app={lenraApp} />
    </React.StrictMode>
  );
}

```

## Connect to the todo route

In the `List.js`, you can use the Lenra socket to connect to the routes you'll later define in the Lenra app `manifest.js`.

In this example, we'll first connect to the `/todos` route using the router. React need states variables to be updated in order to re-render the component. So we'll use the`useState`hook to store the routes and the todos and filters objects that will contains the json of each routes which will be able to use later in the`List` component.

{:data-file="src/List.js"}

```jsx
/**
 * @param {{ socket: LenraSocket }} props
 */
function List(props) {
    const [filter, setFilter] = useState("All");
    const [todosRoute, setTodosRoute] = useState(null);
    const [jsonView, setJsonView] = useState({});
    const [tasks, setTasks] = useState([]);
  
    const { socket } = props;
  
    useEffect(() => {
      const todosRoute = socket?.route("/todos", (json) => {
        console.log('Get todos', json)
        setJsonView(json);
        setTasks(json.todos);
      });
      setTodosRoute(todosRoute);
    }, [socket]);
	[...]
}
```

You will update the App component to pass the socket to the `List` component.

{:data-file="src/App.js"}

```jsx
return (
    <div className="todoapp stack-large">
      {socket ? (
        <List socket={socket}/>
      ) : (
        <LoginButton onClick={() => {
          app.connect().then((value) => {
            setSocket(value);
          });
        }}
        />
      )}
    </div >
  );
```

You can now update the `List` component to use thoses json parameters that describe your UI's data.

In this example, I just copy pasted the code from the original `List.js` file and replaced the static data by the json data from the routes.

I also removed all `setState` call because it's not needed anymore here.

To handle the events, I used the `callListener` method of the `LenraRoute` object that will call the listener of the route with the event object as parameter if needed.

Example of adaptation of the editTask function in the `List.js` file :

{:data-file="src/List.js"}

```jsx
  function editTask(id, newName) {
    const task = tasks.find(task => task.id === id);
    todosRoute.callListener({...task.onEdit, event: { value: newName }});
  }
```

Here the full code of this `List.js` file if needed :

{:data-file="src/List.js"}

```jsx
import React, { useState, useRef, useEffect } from "react";
import Form from "./Form";
import FilterButton from "./FilterButton";
import Todo from "./Todo";
import { nanoid } from "nanoid";


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);
/**
 * @param {{ socket: LenraSocket }} props
 */
function List(props) {
    const [filter, setFilter] = useState("All");
    const [todosRoute, setTodosRoute] = useState(null);
    const [jsonView, setJsonView] = useState({});
    const [tasks, setTasks] = useState([]);
  
    const { socket } = props;
  
    useEffect(() => {
      const todosRoute = socket?.route("/todos", (json) => {
        console.log('Get todos', json)
        setJsonView(json);
        setTasks(json.tasks);
      });
      setTodosRoute(todosRoute);
    }, [socket]);


  function toggleTaskCompleted(id) {
    const task = tasks.find(task => task.id === id);
    todosRoute.callListener(task.onToggle);
  }

  function deleteTask(id) {
    const task = tasks.find(task => task.id === id);
    todosRoute.callListener(task.onDelete);
  }

  function editTask(id, newName) {
    const task = tasks.find(task => task.id === id);
    todosRoute.callListener({...task.onEdit, event: { value: newName }});
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    todosRoute.callListener({...jsonView.addTask, event: { value: name }});
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default List;
```

Start the react app:

```bash
npm i
npm start
```

In another terminal, start the lenra devtool

```bash
lenra dev
```

Open the react app and click on the login button when the devtool is healthy.
You should see a popup openning and quickly closing itself.
If you see this, you are connected to Lenra.

Now that you can successfully connected to your app, we can start to write code of the backend part of the app.

## Lenra app

Now that our client app is connected to Lenra, we can start to write the backend part of the app.
We'll first remove the template code of the `app-lenra` folder:

```bash
rm -rf app-lenra/src/views/lenra/
rm -f app-lenra/src/views/counter.js
rm -f app-lenra/src/listeners/increment.js
```

We also will empty the system listeners functions in the `app-lenra/src/listeners/systemEvents.js` file:

{:data-file="app-lenra/src/listeners/systemEvents.js"}

```js
/**
 * 
 * @param {import("@lenra/app").} _props 
 * @param {import("@lenra/app").event} _event 
 * @param {import("@lenra/app").Api} api 
 */
export async function onEnvStart(_props, _event, _api) {
    
}

export async function onUserFirstJoin(_props, _event, _api) {
    
}

export async function onSessionStart(_props, _event, _api) {

}
```

### The Todo class

In the `app-lenra` folder, we will first create the `Todo` class as our data model in the `src/classes/Todo.js`.

This extends the `Data` class from the `@lenra/app` lib that allow the class to be stored in the database as documents with each fields as properties of the document.

{:data-file="app-lenra/src/classes/Todo.js"}

```javascript
import { Data } from "@lenra/app";

export class Todo extends Data {
    /**
     *
     * @param {string} user
     * @param {string} name
     * @param {boolean} completed
     */
    constructor(user, name, completed = false) {
        super();
        this.user = user;
        this.name = name;
        this.completed = completed;
    }
}
```

### The todos view

Now we'll define the todos view that will handle the data of the app.

The first parameter of the function will be an array of the data returned by the query of the view. The second parameter will be the props passed to the view in the manifest.

We can with that return the data we need to display in the UI in your app, but also define some listeners call that will be called when the user will interact with your app using the `Listeners` class from the `@lenra/app` lib. The props passed to the listener will allow you to pass data to the listener call without even letting the user know about it. (No data is sent to the client app)

This view will return an object with the `tasks` array that will contain the todos data, on each todos we'll add a listener to update it's state or to delete it. And the `addTask` listener that will be called when the user will add a new todo.

{:data-file="app-lenra/views/todos.js"}

```js
import { Listener } from "@lenra/app";
import { Todo } from "../classes/Todo.js";

/**
 *
 * @param {Todo[]} param0
 * @param {*} _props
 * @returns {import("@lenra/app").JsonViewResponse}
 */
export default function todos (todos, _props) {
  return {
    tasks: todos.map((todo) => ({
      id: todo._id,
      name: todo.name,
      completed: todo.completed,
      onToggle: Listener("toggleTodo")
        .props({
          id: todo._id,
          state: !todo.state
        }),
      onDelete: Listener("deleteTodo").props({
        id: todo._id
      }),
      onEdit: Listener("editTodo").props({
        id: todo._id
      })
    })),
    addTask: Listener("addTodo")
  };
}
```

### Update of the manifest

We'll now update the `manifest.js` file that will define each accessible routes of the app.

The `View()` function allow you to define a view call with a query that will be used to filter the data of the view. You can use the `@me` keyword to get the current user id.

{:data-file="app-lenra/manifest.js"}

```js
import { View } from "@lenra/app";
import { Todo } from "./classes/Todo.js";

/**
 * @type {import("@lenra/app").Manifest["json"]}
 */
export const json = {
    routes: [
        {
            path: "/todos",
            view: View("todos").find(Todo, {
                "user": "@me"
            })
        }
    ]
};
```

### Create the listeners

Now that we have the view that will handle the data of the app, we'll create the listeners that will handle the events of the app.

Let's start with the `addTodo` listener:

{:data-file="app-lenra/listeners/addTodo.js"}

```javascript
import { Todo } from "../classes/Todo.js";

/**
 *
 * @param {import("@lenra/app").props} props
 * @param {import("@lenra/app").event} _event
 * @param {import("@lenra/app").Api} api
 * @returns
 */
export default async function addTodo (_props, event, api) {
    const todo = new Todo("@me", event.value);
    await api.data.coll(Todo).createDoc(todo);
}
```

Reload your Lenra app and refresh your browser.
You should be able to add todos to your list.

Now we'll create the `toggleTodo` listener:

{:data-file="app-lenra/listeners/toggleTodo.js"}

```javascript
import { Todo } from "../classes/Todo.js";

/**
 *
 * @param {import("@lenra/app").props} props
 * @param {import("@lenra/app").event} _event
 * @param {import("@lenra/app").Api} api
 * @returns
 */
export default async function toggleTodo(props, _event, api) {
    const transaction = await api.data.startTransaction();
    const coll = transaction.coll(Todo);
    const todo = await coll.getDoc(props.id);
    todo.completed = !todo.completed;
    await coll.updateDoc(todo);
    await transaction.commit();
}
```

And the `deleteTodo` listener:

{:data-file="app-lenra/listeners/deleteTodo.js"}

```javascript
import { Todo } from "../classes/Todo.js";

/**
 *
 * @param {import("@lenra/app").props} props
 * @param {import("@lenra/app").event} _event
 * @param {import("@lenra/app").Api} api
 * @returns
 */
export default async function deleteTodo (props, event, api) {
    await api.data.coll(Todo).deleteDoc({ _id: props.id });
}
```

And the `editTodo` listener:

{:data-file="app-lenra/listeners/editTodo.js"}

```javascript
import { Todo } from "../classes/Todo.js";

/**
 *
 * @param {import("@lenra/app").props} props
 * @param {import("@lenra/app").event} _event
 * @param {import("@lenra/app").Api} api
 * @returns
 */
export default async function editTodo(props, event, api) {
    const transaction = await api.data.startTransaction();
    const coll = transaction.coll(Todo);
    const todo = await coll.getDoc(props.id);
    todo.name = event.value;
    await coll.updateDoc(todo);
    await transaction.commit();
}
```

And your app works !