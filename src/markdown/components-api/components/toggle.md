# toggle

This component can be toggled on or off.

## Examples

### Simple toggle

```json
{
    "type": "toggle",
    // The value is stored in the app data
    "value": data,
    "onPressed": {
        // This listener takes care of toggling the value of this toggle component.
        "code": "toggle",
    }
},
```