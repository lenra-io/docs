# radio

This component is basically a radio component as you might know it from other frameworks.

The radio component uses the `value` and `groupValue` properties to know whether it should be checked or not. The `value` property holds the value of the radio component and the `groupValue` property holds the current selected radio value for a group of radios.

## Examples

### Basic selected radio

```json
{
    "type": "radio",
    "value": "a",
    "groupValue": "a",
}
```

### Group of radios

```json
{
    "type": "flex",
    "children": [
        {
            "type": "radio",
            // This radio will be selected because the groupValue matches the value
            "value": "a",
            "groupValue": "a",
        },
        {
            "type": "radio",
            // This radio will not be selected because the groupValue does not match the value
            "value": "b",
            "groupValue": "a",
        },
    ]
}

```