# flexible

The Flexible component can be used to define the way in which its child flexes.
 
## Examples

### Simple flexible

The default flexible behavior when only using the child property is to take all of the remaining space of the parent.

```json
{
    "type": "flexible",
    "child": {
        "type": "text",
        "value": "Text in flexible"
    }
}
```

### Flexible `flex` property

A flexible component can use the `flex` property as a factor to determine the space to take on the screen. This makes sense when using multiple flexible components.

```json
{
    "type": "flex",
    "children": [
        {
            "type": "flexible",
            "flex": 1,
            "child": {
                "type": "text",
                "value": "1/4 of the screen width"
            }
        },
        {
            "type": "flexible",
            "flex": 3,
            "child": {
                "type": "text",
                "value": "3/4 of the screen width"
            }
        }
    ]
}
```

### Flexible `fit` property

A flexible component can use the `fit` property to decide how it will fill the available space. Using `tight` will take all of the available space while using `loose` will take a minimal amount of space.

Flexible uses a `loose` fit by default.

```json
{
    "type": "flexible",
    "fit": "tight",
    "child": {
        "type": "text",
        "value": "Text in flexible"
    }
}
```