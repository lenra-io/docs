# widget

This component calls a widget defined in the application. This can be used to create reusable widgets across the application and call them from anywhere.

The widget must be defined and references in the index.js root file of the application.

## Examples

### Simple widget

Create a file that will contain the widget.

```json
module.exports = (users, _props) => {
  return {
    "type": "text",
    "value": "This is a widget",
  };
}
```

Reference this widget in the root index.js of the application.

```json
module.exports = async () => {
  return {
    widgets: {
        myWidget: require('./widgets/myWidget.js'),
    },
    listeners: {},
    rootWidget: 'main'
  }
}
```

Then instantiate the widget in the root widget of the application.

```json
module.exports = (users, _props) => {
  return {
    "type": "flex",
    "children": [
        {
            "type": "text",
            "value": "This the root widget",
        },
        // Will call myWidget and show the "This is a widget" text
        {
            "type": "widget",
            "name": "myWidget",
        }
    ]
  };
}
```