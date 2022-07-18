# button

This is the button component. 

You can set its text, disabled it, adjust its size and style, react to click and add left or right icons.

## Examples

**Simple button**

```json
{
    "type": "button",
    "text": "My button",
    "onPressed": {
        "action": "buttonPressed"
    },
}
```

**disabled button**

```json
{
    "type": "button",
    "text": "My button",
    "disabled": true,
}
```

**size and style adjusted button**

```json
{
    "type": "button",
    "text": "My button",
    "size": "large",
    "mainStyle": "secondary",
}
```

**button with icons**

```json
{
    "type": "button",
    "text": "My button",
    "leftIcon": {
        "type": "icon",
        "value": "smart_button",
    },
    "rightIcon": {
        // You can also use a widget instead of an icon
        "type": "text",
        "value": "This can be used as an icon"
    },
}
```
