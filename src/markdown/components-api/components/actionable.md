# actionable

This component makes its child actionable based on the defined properties.

When stacking two or more actionables of the same size and using the same attribute, only the lowest one in the tree will be called.
 
## Examples

### Making a text clickable

```json
{
    "type": "actionable",
    "onPressed": {
        "action": "textPress",
        "props": {
            ...
        }
    },
    "child": {
        "type": "text", 
        "value": "This is an actionable text."
    }
}
```

### Handling multiple events.

```json
{
    "type": "actionable",
    "onPressed": {
        "action": "pressedOnceAction",
    },
    "onDoublePressed": {
        "action": "doublePressedAction",
    },
    "onLongPressed": {
        "action": "longPressedAction",
    },
    "onHovered": {
        "action": "hoveredAction",
    },
    "child": {
        "type": "text", 
        "value": "This is an actionable text."
    }
}
```

### Stacking actionables with same attribute.



```json
{
    "type": "actionable",
    "onPressed": {
        // Will not be called because there is an actionable below that defines the onPressed attribute
        // Note that if this actionable was sized to be bigger than the actionable below, it would be possible to trigger this onPressed
        "action": "willNotBeCalled",
    },
    "onDoublePressed": {
        // Will be called because there is no actionable below that defines this attribute
        "action": "willBeCalled",
    },
    "child": {
        "type": "actionable",
        "onPressed": {
            "action": "willBeCalled",
        },
        "child": {
            "type": "text", 
            "value": "This is an actionable text."
        }
    }
}
```