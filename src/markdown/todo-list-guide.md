# TODO List Guide

A guide that explains how to create a todo list application from the basics of the Lenra UI System to the usage of the Data API with queries, data references and more.

## Prerequisites

In this guide we will create a todo list application using the Lenra node template. 
Create this new application using the following command.

```console
lenra new node todo-list-app-guide
```

This will create a new folder containing a basic implementation of a Lenra application, our starting point to create the Todo List application.

## Introduction to Lenra Application development

When creating your new application using a template, you will see that some files were automatically generated for you to get a first runnable application. Let's take a tour of these generated files to understand their role and how to edit these to match our needs.
The first file that is required to run the application is the `index.js`, it references all the widgets and listeners of the application. We can see that the base application has 5 widgets and 3 listeners, widgets are parts of the UI that can be referenced into other widgets. Listeners are called when an event occurs on the application such as a click on a button but there is also 3 listeners that can be defined that are called when the app enters some state such as `environment start`, `session start`, `user first join` their role will be explained in the following section.

### Listeners 




