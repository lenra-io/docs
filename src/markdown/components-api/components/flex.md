# flex

The Flex component is a container that displays its children in a row or column.
 
## Examples

### Simple flex

The flex component lays its children horizontally by default.

```json
{
    "type": "flex",
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"}
    ]
}
```

### Vertical flex

```json
{
    "type": "flex",
    "direction": "vertical",
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"}
    ]
}
```

### Flex children alignment

The children of the flex can be aligned along and across its `direction`, the properties for that are respectively called `mainAxisAlignment` and `crossAxisAlignment`.

```json
{
    "type": "flex",
    "mainAxisAlignment": "center",
    "crossAxisAlignment": "center",
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"}
    ]
}
```

### Spacing children of flex & padding

The children of the flex component can be spaced out by using the `spacing` property. The amount of spacing defined in this property will be factored by the current Theme's `baseSize` attribute which by default is set to 8. This means that by setting a spacing of 2, the children will be 16 units apart.

A padding can also be added to the flex. For example if the flex is at the root of your application, you might want to add some padding to not be too close to the screen border.

```json
{
    "type": "flex",
    "spacing": 2,
    "padding": {
        "top": 10,
        "left": 10,
        "right": 10,
        "bottom": 10,
    },
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"}
    ]
}
```

### Fill parent of flex

The flex can be set to fill its parent in the main axis.

```json
{
    "type": "flex",
    "fillParent": true,
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"}
    ]
}
```

### Flex scroll

Sometimes a flex can have a lot of children, this can cause the content to get out of the screen. To make sure that all of the content is readable, use the `scroll` property.

```json
{
    "type": "flex",
    "scroll": true,
    "children": [
        {"type": "text", "value": "First child"},
        {"type": "text", "value": "Second child"},
        {"type": "text", "value": "Third child that has a text length that causes it to go out of the screen"}
    ]
}
```
