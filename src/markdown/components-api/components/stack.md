# stack

This component is used to make its children overlap. This is particularly interesting when building complex widgets that needs to put some content above an image or for styling some widgets.
The first child in the list will be in the background while the last child of the list will be in the foreground of the stack.

## Examples

### Stacking containers

This example will show two boxes, a red one at the background and a green one in the foreground. Both are respectively sized 100x100 and 60x60 so that they can be seen.

```json
{
    "type": "stack",
    "children": [
        {
        "type": "container",
        "decoration": {"color": 0xFFFF0000},
        "constraints": {
            "minWidth": 100,
            "maxWidth": 100,
            "minHeight": 100,
            "maxHeight": 100,
        },
        "child": {"type": "text", "value": "This is in the background"}
        },
        {
        "type": "container",
        "decoration": {"color": 0xFF00FF00},
        "constraints": {
            "minWidth": 60,
            "maxWidth": 60,
            "minHeight": 60,
            "maxHeight": 60,
        },
        "child": {"type": "text", "value": "This is in the foreground."}
        },
    ]
}
```