# overlayEntry

This component is used to create an **overlay** that shows itself over the current application's UI. For example, it might be interesting to use it when displaying errors in a snackbar.

This component uses the `showOverlay` boolean property to know whether it should be shown to the screen or not. This property **should be used** to open/close the overlayEntry. The overlayEntry **should not be** directly removed from the JSON tree as it will not follow the right disposing process, the overlayEntry will end up stuck on the screen with no way to remove it.

It is recommended to put overlays inside the root `flex` component of the application. An example is shown below.

## Examples

### Simple overlayEntry

```json
{
    "type": "overlayEntry",
    "showOverlay": true,
    "child": {
        "type": "text",
        "value": "This text is shown inside of an overlayEntry."
    }
}
```

### Recommended : Overlays in root component

```json
{
    "type": "flex",
    "children": [
        {
            "type": "text",
            "value": "This is the main UI of the app",
        },
        // Add overlays in root flex component.
        { 
            "type": "overlayEntry",
            "showOverlay": true,
            "child": {
                "type": "text",
                "value": "This text is shown inside of an overlayEntry."
            }
        }
    ]
}
```

