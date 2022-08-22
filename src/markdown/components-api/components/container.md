# container

The container component that can be used to apply border, padding, constraints or decoration to its child.
 
## Examples

### Simple container

```json
{
    "type": "container",
    "child": {
        "type": "text",
        "value": "Text inside a container",
    }
}
```

### Container with padding

```json
{
    "type": "container",
    "padding": {
        "top": 8, 
        "left": 8, 
        "bottom": 8, 
        "right": 8
    },
    "child": {
        "type": "text", 
        "value": "Text inside a container with padding"
    }
}
```

### Container with border

```json
{
    "type": "container",
    // We use a width of 3 for each side of the border and a blue color
    "border": {
        "top": {"width": 3, "color": 0xFF36D8F1},
        "left": {"width": 3, "color": 0xFF36D8F1},
        "bottom": {"width": 3, "color": 0xFF36D8F1},
        "right": {"width": 3, "color": 0xFF36D8F1},
    },
    "child": {
        "type": "text", 
        "value": "Text inside a container with border"
    }
}
```

### Container with constraints

```json
{
    "type": "container",
    "decoration": {"color": 0xFFFF0000},
    "constraints": {
        "minWidth": 100,
        "maxWidth": 100,
        "minHeight": 100,
        "maxHeight": 100,
    },
    "child": {
        "type": "text", 
        "value": "Text inside a 100x100 container"
    }
},
```

### Container with decoration

```json
{
    "type": "container",
    "decoration": {
        "color": 0xFFE0F7F4,
        "borderRadius": {
            "topLeft": {
                "x": 10,
                "y": 10,
            },
            "bottomRight": {
                "x": 10,
                "y": 10,
            },
        },
        "boxShadow": {
            "color": 0x42000000,
            "blurRadius": 3,
            "spreadRadius": 3,
            "offset": {"dx": 5, "dy": 2}
        }
    },
    "child": {
        "type": "text", 
        "value": "Text inside a container with decoration"
    }
}
```