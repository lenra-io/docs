# dropdownButton

A dropdown button that can be used to open a dropdown menu when clicked.
 
## Examples

### Simple dropdown button

This creates a dropdown button that shows a button `Menu Button` when clicked.

```json
{
    "type": "dropdownButton",
    "text": "Simple",
    "child": {
        "type": "button",
        "text": "Menu Button",
        "mainStyle": "secondary",
        "onPressed": {"code": "doSomething"},
    },
}
```

### Disabled dropdown button

This creates a disabled dropdownButton, this means that it cannot be opened. The `child` property is still necessary even though it is impossible to show it.

```json
{
    "type": "dropdownButton",
    "text": "Disabled dropdown",
    "disabled": true,
    "child": {
        "type": "text",
        "value": "Mandatory child",
    }
}
```

### Sized and styled dropdown button

```json
{
    "type": "dropdownButton",
    "text": "Sized dropdown",
    "size": "large",
    "mainStyle": "tertiary",
    "child": {
        "type": "text",
        "value": "Mandatory child",
    }
}
```

### Dropdown button with icon

```json
{
    "type": "dropdownButton",
    "text": "Dropdown button with icon",
    "icon": {
        "type": "icon", 
        "value": "yard_sharp"
    },
    "child": {
        "type": "text",
        "value": "foo",
    },
}
```
