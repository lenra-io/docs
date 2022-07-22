# textfield

This component gives the possibility to the user to write text.

## Examples

### Basic textfield

```json
{
    "type": "textfield", 
    "value": "fixedValue",
    "onChanged": {
        // This listener cannot change the value because the value is fixed to "fixedValue"
        "action": "changeValue"
    }
}
```


### Complex textfield

```json
{
    "type": "textfield",
    // The value is stored in the app data
    "value": data,
    "style": {
        "decoration": {
            "icon": {
                "type": "icon",
                "value": "star",
            },
            "filled": true,
            "fillColor": 0xFFBBDEFB,
            "border": {
                "type": "outline",
            },
            "hintText": "hint",
            "helperText": "helper",
            "labelText": "label",
            // Showing the string length under the textfield
            "counterText": "${data.length}"
        },
    },
    "minLines": 3,
    "maxLines": 5,
    // This listener takes care of changing the value in the app data
    "onChanged": {"code": "CodeA"}
},
```