# menuItem

This component is made to be used with the `menu` component. This will ensure that the styling is correct and that the menu items are properly sized.
 
## Examples

### Simple menuItem

```json
{
    "type": "menuItem",
    "text": "Simple menuItem",
}
```

### MenuItem icon & on pressed

```json
{
    "type": "menuItem",
    "text": "Menu Item",
    "icon": {
        "type": "icon",
        "value": "abc",
    },
    "onPressed": {
        "action": "pressed"
    }
}
```